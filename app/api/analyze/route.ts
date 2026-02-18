import { NextRequest, NextResponse } from 'next/server';
import { parseResumeWithAI } from '@/lib/agents/resume-parser';
import { calculateMarketScore } from '@/lib/agents/market-scorer';
import { supabase } from '@/lib/supabase';

export const maxDuration = 60; // 5 minutes
export const dynamic = 'force-dynamic';

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

        // Transform to new UI structure
        const responseData = {
            id: data.id,
            candidateName: parsedResume.name || 'Candidate',
            jobTitle: parsedResume.jobTitle || 'Tech Professional',
            totalScore: Math.round((marketScore.australiaScore + marketScore.koreaScore) / 2),
            summary: parsedResume.summary || 'A detailed analysis of your profile.',
            salary: {
                au: { currency: 'AUD', min: 85000, max: 130000, median: 105000 }, // Mock data for now, would come from scorer
                kr: { currency: 'KRW', min: 45000000, max: 80000000, median: 60000000 },
            },
            marketFit: {
                au: { score: marketScore.australiaScore, topSkills: parsedResume.techStack, missingSkills: [] },
                kr: { score: marketScore.koreaScore, topSkills: parsedResume.techStack, missingSkills: [] },
            },
            actionPlan: [
                { priority: 'High', task: 'Update LinkedIn profile for AU market', deadline: 'Day 3' },
                { priority: 'Medium', task: 'Learn React Server Components', deadline: 'Day 14' },
                { priority: 'High', task: 'Apply to Global Talent Visa', deadline: 'Day 30' },
            ],
            createdAt: new Date().toISOString(),
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze resume' },
            { status: 500 }
        );
    }
}
