import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const { analysisId } = await request.json();

        if (!analysisId) {
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
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/report/${analysisId}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/report/${analysisId}?canceled=true`,
            metadata: {
                analysisId,
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
