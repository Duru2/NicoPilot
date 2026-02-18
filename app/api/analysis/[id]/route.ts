import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
        }

        const parsedResume = data.parsed_resume;
        const marketScore = data.market_score;

        // Transform to new UI structure
        const responseData = {
            id: data.id,
            candidateName: parsedResume.name || 'Candidate',
            jobTitle: parsedResume.jobTitle || 'Tech Professional',
            totalScore: Math.round((marketScore.australiaScore + marketScore.koreaScore) / 2),
            summary: parsedResume.summary || 'A detailed analysis of your profile.',
            salary: {
                au: { currency: 'AUD', min: 85000, max: 130000, median: 105000 },
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
            createdAt: data.created_at,
            isPaid: data.is_paid,
            report: data.report
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analysis' },
            { status: 500 }
        );
    }
}
