import { NextRequest, NextResponse } from 'next/server';
import { parseResumeWithAI } from '@/lib/agents/resume-parser';
import { calculateMarketScore } from '@/lib/agents/market-scorer';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { resumeText } = await request.json();

        if (!resumeText || resumeText.trim().length < 50) {
            return NextResponse.json(
                { error: 'Resume text is too short or empty' },
                { status: 400 }
            );
        }

        // Parse resume with AI
        const parsedResume = await parseResumeWithAI(resumeText);

        // Calculate market scores
        const marketScore = await calculateMarketScore(parsedResume);

        // Save to database
        const { data, error } = await supabase
            .from('analyses')
            .insert({
                parsed_resume: parsedResume,
                market_score: marketScore,
                is_paid: false,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to save analysis' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            id: data.id,
            parsedResume,
            marketScore,
            isPaid: false,
        });
    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze resume' },
            { status: 500 }
        );
    }
}
