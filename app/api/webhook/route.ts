import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { generateStrategyReport } from '@/lib/agents/report-generator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const analysisId = session.metadata?.analysisId;

            if (!analysisId) {
                console.error('No analysisId in metadata');
                return NextResponse.json({ error: 'No analysisId' }, { status: 400 });
            }

            // Get the analysis
            const { data: analysis, error: fetchError } = await supabase
                .from('analyses')
                .select('*')
                .eq('id', analysisId)
                .single();

            if (fetchError || !analysis) {
                console.error('Failed to fetch analysis:', fetchError);
                return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
            }

            // Generate the full report
            const report = await generateStrategyReport(
                analysis.parsed_resume,
                analysis.market_score
            );

            // Update the analysis with the report and mark as paid
            const { error: updateError } = await supabase
                .from('analyses')
                .update({
                    report,
                    is_paid: true,
                })
                .eq('id', analysisId);

            if (updateError) {
                console.error('Failed to update analysis:', updateError);
                return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
