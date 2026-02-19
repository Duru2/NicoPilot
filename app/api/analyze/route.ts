import { NextRequest, NextResponse } from 'next/server';
import { parseResumeWithAI } from '@/lib/agents/resume-parser';
import { generateComprehensiveReport } from '@/lib/agents/report-generator';
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
        console.log('Parsing resume...');
        const parsedResume = await parseResumeWithAI(resumeText);
        console.log('Resume parsed successfully.');

        // Generate comprehensive strategy report
        console.log('Generating strategy report...');
        const report = await generateComprehensiveReport(parsedResume);
        console.log('Strategy report generated successfully.');

        // Extract simplified scores for DB compatibility
        const marketScore = {
            australiaScore: report.diagnosis.marketAlignment.australia,
            koreaScore: report.diagnosis.marketAlignment.korea,
            factors: {
                // Approximate mapping or default values since we don't have these granular factors anymore
                marketDemand: (report.diagnosis.marketAlignment.australia + report.diagnosis.marketAlignment.korea) / 2,
                englishRequirement: report.diagnosis.languageRisk === 'High' ? 90 : report.diagnosis.languageRisk === 'Medium' ? 50 : 20,
                visaDifficulty: report.diagnosis.visaRisk === 'High' ? 90 : report.diagnosis.visaRisk === 'Medium' ? 50 : 20,
                competitionLevel: 70, // Default
                salaryFit: 80, // Default
            }
        };

        // Save to database
        console.log('Saving to Supabase...');
        const { data, error } = await supabase
            .from('analyses')
            .insert({
                parsed_resume: parsedResume,
                market_score: marketScore,
                report: report, // Save the full new report
                is_paid: false,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', JSON.stringify(error, null, 2));
            return NextResponse.json(
                { error: `Database Error: ${error.message || 'Failed to save analysis'}` },
                { status: 500 }
            );
        }
        console.log('Saved to Supabase successfully.');

        // Return the full analysis object
        const responseData = {
            id: data.id,
            parsedResume,
            marketScore,
            report,
            createdAt: new Date().toISOString(),
        };

        return NextResponse.json(responseData);
    } catch (error: any) {
        console.error('Analysis error details:', error);
        return NextResponse.json(
            { error: `Analysis Failed: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
