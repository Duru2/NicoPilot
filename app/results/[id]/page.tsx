'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

// Define strict types for our data structure
interface SalaryData {
    currency: string;
    min: number;
    max: number;
    median: number;
}

interface ActionItem {
    priority: 'High' | 'Medium' | 'Low';
    task: string;
    deadline: string;
}

interface MarketFit {
    score: number;
    demandLevel: 'Very High' | 'High' | 'Medium' | 'Low';
    topSkills: string[];
    missingSkills: string[];
}

interface AnalysisData {
    id: string;
    candidateName: string;
    jobTitle: string;
    totalScore: number;
    summary: string;
    salary: {
        au: SalaryData;
        kr: SalaryData;
    };
    marketFit: {
        au: MarketFit;
        kr: MarketFit;
    };
    actionPlan: ActionItem[];
    createdAt: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ResultsPage() {
    const params = useParams(); // params is not a Promise in Client Components, but next 15 cautions. 
    // Actually in Client Components `useParams` returns the object directly.
    const searchParams = useSearchParams();
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        // Check for success payment
        if (searchParams.get('success')) {
            setIsPaid(true);
        }

        const fetchAnalysis = async () => {
            try {
                // In a real app we might need to await params if it was a server component, 
                // but this is 'use client'. `params` from useParams is an object.
                const { id } = params;
                const response = await fetch(`/api/analysis/${id}`);
                if (!response.ok) throw new Error('Failed to fetch analysis');
                const data = await response.json();
                setAnalysis(data);
            } catch (err) {
                setError('Failed to load analysis results');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (params?.id) {
            fetchAnalysis();
        }
    }, [params, searchParams]);

    const handleCheckout = async () => {
        try {
            const stripe = await stripePromise;
            if (!stripe) throw new Error('Stripe failed to load');

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ analysisId: analysis?.id }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            alert(`Payment failed to start: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Generating your career roadmap...</p>
                </div>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center max-w-md">
                    <div className="text-4xl mb-4">😿</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Oops! Something went wrong.</h3>
                    <p className="text-slate-500 mb-6">{error || 'Analysis not found'}</p>
                    <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F4F8] font-sans overflow-x-hidden">
            {/* Background Blobs (Persistent Theme) */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"></div>

            <main className="container mx-auto px-4 py-12 max-w-5xl relative z-10">

                {/* Hero Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="flex justify-center mb-6 cursor-pointer" onClick={() => window.location.href = '/'}>
                        <img src="/logo.svg" alt="NicoPilot" className="h-12 hover:scale-105 transition-transform" />
                    </div>
                    <div className="inline-block px-4 py-1.5 bg-white/50 backdrop-blur border border-blue-100 text-blue-700 rounded-full text-sm font-bold shadow-sm mb-2">
                        🎉 AI Analysis Complete for {analysis.candidateName}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Your Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Career Roadmap</span>
                    </h1>
                </div>

                {/* Main Score Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left space-y-2">
                            <p className="text-slate-500 font-medium uppercase tracking-wider text-sm">Overall Market Match</p>
                            <div className="flex items-baseline gap-2 justify-center md:justify-start">
                                <span className="text-7xl font-black text-slate-900">{analysis.totalScore}</span>
                                <span className="text-2xl text-slate-400 font-bold">/ 100</span>
                            </div>
                            <p className="text-slate-600 text-lg leading-relaxed">{analysis.summary}</p>
                        </div>

                        {/* Interactive Progress Indicators (Cute Style) */}
                        <div className="space-y-6">
                            <MarketScoreRow country="Australia 🇦🇺" score={analysis.marketFit.au.score} color="bg-blue-500" />
                            <MarketScoreRow country="Korea 🇰🇷" score={analysis.marketFit.kr.score} color="bg-pink-500" />
                        </div>
                    </div>
                </div>

                {/* Free Preview Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <SalaryCard country="Australia" data={analysis.salary.au} flag="🇦🇺" />
                    <SalaryCard country="Korea" data={analysis.salary.kr} flag="🇰🇷" />
                </div>

                {/* PAYWALL SECTION (High Conversion) */}
                <div className="relative group">
                    <div className={`transition-all duration-500 ${!isPaid ? 'blur-md opacity-80 select-none pointer-events-none' : ''}`}>
                        {/* Detailed Analysis Content (Hidden/Blurred) */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-2xl">⚡</span> 90-Day Action Plan
                            </h3>
                            <div className="space-y-4">
                                {analysis.actionPlan.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className={`w-2 h-full rounded-full ${item.priority === 'High' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                                        <div>
                                            <div className="font-bold text-slate-800">{item.task}</div>
                                            <div className="text-sm text-slate-500 mt-1">Due: {item.deadline}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA Overlay */}
                    {!isPaid && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg text-center z-20">
                            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/50 transform transition-all hover:scale-105 duration-300">
                                <div className="text-4xl mb-4 animate-bounce">🔓</div>
                                <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                                    Unlock Your Full Potential
                                </h2>
                                <p className="text-slate-600 mb-8 text-lg">
                                    Don't let uncertainty hold you back. <br />
                                    Get the full <strong>90-day execution plan</strong> + detailed skills gap analysis.
                                </p>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white text-xl font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                                >
                                    <span>Unlock Full Report</span>
                                    <span className="bg-white/20 px-2 py-1 rounded text-sm">$29.00</span>
                                </button>
                                <p className="text-xs text-slate-400 mt-4">
                                    100% Satisfaction Guarantee. Secure Payment via Stripe.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}

function MarketScoreRow({ country, score, color }: { country: string, score: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <span className="font-bold text-slate-700">{country}</span>
                <span className="font-bold text-slate-900">{score}%</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
}

function SalaryCard({ country, data, flag }: { country: string, data: SalaryData, flag: string }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{flag}</span>
                <h3 className="font-bold text-slate-700">{country} Salary Estimate</h3>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">
                {data.currency} {data.median.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500 font-medium">
                Median Annual Compensation
            </div>
        </div>
    );
}
