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
        const fullReport = data.report;

        // Transform to new UI structure matching AnalysisData interface
        const responseData = {
            id: data.id,
            parsedResume: parsedResume,
            marketScore: marketScore,
            report: fullReport,
            createdAt: data.created_at,
            isPaid: data.is_paid
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
