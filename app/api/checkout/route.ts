import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const { analysisId } = await request.json();

        // Robust base URL determination
        let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
        if (!baseUrl) {
            const host = request.headers.get('host');
            const protocol = host?.includes('localhost') ? 'http' : 'https';
            baseUrl = `${protocol}://${host}`;
        }

        console.log(`Creating Stripe session. Base URL: ${baseUrl}, Analysis ID: ${analysisId}`);

        if (!analysisId) {
            console.error('Checkout failed: Analysis ID is missing');
            return NextResponse.json(
                { error: 'Analysis ID is required' },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Career Strategy Report',
                            description: 'Comprehensive Australia vs Korea career analysis with 90-day action plan',
                        },
                        unit_amount: 2900, // $29.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/results/${analysisId}?success=true`,
            cancel_url: `${baseUrl}/results/${analysisId}?canceled=true`,
            metadata: {
                analysisId,
            },
        });

        console.log(`Stripe session created: ${session.id}`);
        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
