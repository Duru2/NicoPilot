'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { ParsedResume, MarketScore, StrategyReport } from '@/types';
import PositionDiagnosisSection from '@/components/analysis/PositionDiagnosis';
import MarketComparisonSection from '@/components/analysis/MarketComparison';
import RiskMapSection from '@/components/analysis/RiskMap';
import SkillRoadmapSection from '@/components/analysis/SkillRoadmap';
import ExecutionPlanSection from '@/components/analysis/ExecutionPlan';
import VisaAnalysisSection from '@/components/analysis/VisaAnalysis';
import ResumeStrategySection from '@/components/analysis/ResumeStrategy';
import CompanyRecommendationsSection from '@/components/analysis/CompanyRecommendations';
import dynamic from 'next/dynamic';

interface AnalysisData {
    id: string;
    parsedResume: ParsedResume;
    marketScore: MarketScore;
    report: StrategyReport;
    createdAt: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ResultsPage() {
    const params = useParams();
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
                const { id } = params;
                const response = await fetch(`/api/analysis/${id}`);
                if (!response.ok) throw new Error('분석 결과를 가져오는데 실패했습니다');
                const data = await response.json();
                setAnalysis(data);
            } catch (err) {
                setError('분석 결과를 불러오지 못했습니다');
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
            if (!stripe) throw new Error('Stripe 로드에 실패했습니다');

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ analysisId: analysis?.id }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '결제 세션 생성에 실패했습니다');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('결제 URL이 반환되지 않았습니다');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            alert(`결제를 시작하지 못했습니다: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">상세 커리어 리포트를 생성 중입니다...</p>
                </div>
            </div>
        );
    }

    if (error || !analysis || !analysis.report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center max-w-md">
                    <div className="text-4xl mb-4">😿</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">데이터가 없습니다.</h3>
                    <p className="text-slate-500 mb-6">{error || '분석 리포트를 찾을 수 없습니다. 다시 시도해주세요.'}</p>
                    <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition">홈으로 돌아가기</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-green-100 selection:text-green-900">
            {/* 1. Global Navigation Bar (Academy Style) - Consistent with Main Page */}
            <header className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
                            <span className="text-2xl font-black text-[#00C73C] tracking-tighter">NicoPilot</span>
                            <span className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest hidden sm:block">Career Institute</span>
                        </div>

                        {/* Nav Links */}
                        <nav className="hidden md:flex items-center gap-6 text-[15px] font-bold text-slate-700">
                            <a href="#" className="hover:text-[#00C73C] transition-colors">강사진 소개</a>
                            <a href="#" className="hover:text-[#00C73C] transition-colors">합격수기 <span className="text-red-500 text-xs">N</span></a>
                            <a href="#" className="hover:text-[#00C73C] transition-colors">커리큘럼</a>
                            <a href="#" className="hover:text-[#00C73C] transition-colors">해외취업 가이드</a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-slate-500">
                            {analysis.parsedResume.name || '지원자'}님 <span className="text-[#00C73C]">분석 리포트</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-5xl space-y-12">

                {/* Hero / Report Title */}
                <div className="text-center space-y-4 border-b border-slate-100 pb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold tracking-wide text-slate-600 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#00C73C]"></span>
                        NicoPilot Career Institute Methodology v2.0
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        <span className="text-[#00C73C]">한국 vs 호주</span> <br />
                        커리어 전략 리포트
                    </h1>
                    <p className="text-slate-500 text-lg">
                        {analysis.parsedResume.name}님의 이력서를 바탕으로 <br className="md:hidden" />
                        <span className="font-bold text-slate-800">두 국가의 시장 경쟁력</span>을 비교 분석했습니다.
                    </p>
                </div>

                {/* 1. Position Diagnosis */}
                <PositionDiagnosisSection data={analysis.report.diagnosis} />

                {/* 2. Market Comparison */}
                <MarketComparisonSection data={analysis.report.marketComparison} />

                {/* 3. Risk Map */}
                <RiskMapSection risks={analysis.report.riskMap} />

                {/* 4. Skill Gap & Roadmap */}
                <SkillRoadmapSection
                    australia={analysis.report.skillGap.australia}
                    korea={analysis.report.skillGap.korea}
                />

                {/* PAYWALL BLUR AREA STARTS HERE */}
                <div className="relative group">
                    <div className={`transition-all duration-500 space-y-12 ${!isPaid ? 'blur-lg opacity-60 select-none pointer-events-none h-[800px] overflow-hidden' : ''}`}>

                        {/* 5. Resume Strategy */}
                        <ResumeStrategySection strategy={analysis.report.resumeStrategy} />

                        {/* 6. Execution Plan */}
                        <ExecutionPlanSection plan={analysis.report.executionPlan} />

                        {/* 7. Company Recommendations */}
                        <CompanyRecommendationsSection data={analysis.report.companyFit} />

                        {/* 8. Visa Analysis */}
                        <VisaAnalysisSection data={analysis.report.visaAnalysis} />

                    </div>

                    {/* CTA Overlay */}
                    {!isPaid && (
                        <div className="absolute top-[200px] left-1/2 -translate-x-1/2 w-full max-w-lg text-center z-20">
                            <div className="bg-white/95 backdrop-blur-2xl p-10 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,199,60,0.15)] border border-[#00C73C]/20 transform transition-all hover:scale-[1.01] duration-300">
                                <div className="text-4xl mb-6">🔒</div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    <span className="text-[#00C73C]">합격 시크릿 노트</span>를 열어보세요
                                </h2>
                                <p className="text-slate-500 text-sm mb-8">상위 1% 합격자들의 데이터로 검증된 전략입니다.</p>

                                <div className="space-y-3 mb-8 text-left bg-slate-50 p-6 rounded-xl border border-slate-100 text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#E8F8EE] text-[#00C73C] flex items-center justify-center text-xs font-bold">V</div>
                                        <span className="font-bold text-slate-700">90일 합격 실행 플랜 (주별 가이드)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#E8F8EE] text-[#00C73C] flex items-center justify-center text-xs font-bold">V</div>
                                        <span className="font-bold text-slate-700">나에게 딱 맞는 히든 기업 리스트</span>
                                    </div>
                                    <div className="space-y-3 pl-8 border-l-2 border-slate-100 ml-2.5 my-3">
                                        {analysis.report.executionPlan.month1.steps.slice(0, 3).map((item, i) => (
                                            <div key={i} className="text-xs text-slate-500">
                                                <span className="font-bold text-slate-700 block mb-0.5">{item.task}</span>
                                                {item.description}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#E8F8EE] text-[#00C73C] flex items-center justify-center text-xs font-bold">V</div>
                                        <span className="font-bold text-slate-700">비자 승인 확률을 높이는 전략</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-[#00C73C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#00b035] transition-all shadow-md shadow-green-200 flex items-center justify-center gap-3"
                                >
                                    <span>전체 리포트 열람하기</span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-semibold">29,000원</span>
                                </button>
                                <p className="mt-4 text-xs text-slate-400 font-medium">
                                    불만족 시 100% 환불 보장
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </main>

            <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center text-slate-400 text-sm">
                © 2026 NicoPilot Career Institute. All rights reserved.
            </footer>
        </div>
    );
}
