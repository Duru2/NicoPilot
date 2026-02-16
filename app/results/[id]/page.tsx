'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Analysis {
    id: string;
    parsedResume: any;
    marketScore: any;
    report?: any;
    isPaid: boolean;
}

export default function ResultsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const success = searchParams.get('success');

    useEffect(() => {
        fetchAnalysis();
    }, [params.id]);

    const fetchAnalysis = async () => {
        try {
            const response = await fetch(`/api/analysis/${params.id}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setAnalysis(data);
        } catch (error) {
            console.error('Failed to fetch analysis:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePurchase = async () => {
        setIsCheckingOut(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ analysisId: params.id }),
            });

            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Checkout failed:', error);
            setIsCheckingOut(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">분석 결과를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">분석 결과를 찾을 수 없습니다.</p>
                </div>
            </div>
        );
    }

    const { marketScore, parsedResume, isPaid, report } = analysis;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Success Message */}
                    {success === 'true' && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                            ✅ 결제가 완료되었습니다! 전체 리포트를 확인하세요.
                        </div>
                    )}

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">분석 결과</h1>
                        <p className="text-gray-600">AI가 분석한 당신의 커리어 적합도</p>
                    </div>

                    {/* Market Scores */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Australia Score */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">🇦🇺 호주</h2>
                                <div className="text-4xl font-bold text-blue-600">
                                    {marketScore.australiaScore}
                                    <span className="text-xl text-gray-400">/100</span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
                                    style={{ width: `${marketScore.australiaScore}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-600">
                                {marketScore.australiaScore >= 70
                                    ? '✅ 높은 적합도! 호주 시장에서 경쟁력이 있습니다.'
                                    : marketScore.australiaScore >= 50
                                        ? '⚠️ 중간 적합도. 추가 준비가 필요할 수 있습니다.'
                                        : '❌ 낮은 적합도. 스킬 개발이 필요합니다.'}
                            </p>
                        </div>

                        {/* Korea Score */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">🇰🇷 한국</h2>
                                <div className="text-4xl font-bold text-purple-600">
                                    {marketScore.koreaScore}
                                    <span className="text-xl text-gray-400">/100</span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all"
                                    style={{ width: `${marketScore.koreaScore}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-600">
                                {marketScore.koreaScore >= 70
                                    ? '✅ 높은 적합도! 한국 시장에서 경쟁력이 있습니다.'
                                    : marketScore.koreaScore >= 50
                                        ? '⚠️ 중간 적합도. 추가 준비가 필요할 수 있습니다.'
                                        : '❌ 낮은 적합도. 스킬 개발이 필요합니다.'}
                            </p>
                        </div>
                    </div>

                    {/* Profile Summary */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">프로필 요약</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">경력</h3>
                                <p className="text-lg">{parsedResume.yearsOfExperience}년</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">시니어리티</h3>
                                <p className="text-lg capitalize">{parsedResume.seniorityLevel}</p>
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="font-semibold text-gray-700 mb-2">기술 스택</h3>
                                <div className="flex flex-wrap gap-2">
                                    {parsedResume.techStack.map((tech: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Paywall or Report */}
                    {!isPaid ? (
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-white text-center">
                            <div className="text-5xl mb-4">🚀</div>
                            <h2 className="text-3xl font-bold mb-4">전체 전략 리포트 보기</h2>
                            <p className="text-xl mb-8 opacity-90">
                                상세한 시장 분석, 연봉 예측, 90일 액션 플랜 포함
                            </p>
                            <div className="bg-white/20 rounded-xl p-6 mb-8 backdrop-blur-sm">
                                <ul className="text-left space-y-3">
                                    <li className="flex items-center">
                                        <span className="mr-3">✅</span>
                                        <span>상세 시장 적합도 분석</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-3">✅</span>
                                        <span>리스크 요인 분석</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-3">✅</span>
                                        <span>연봉 예측 (AUD & KRW)</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-3">✅</span>
                                        <span>스킬 갭 분석</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-3">✅</span>
                                        <span>90일 액션 플랜</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-3">✅</span>
                                        <span>PDF 다운로드</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-4xl font-bold mb-6">$29</div>
                            <button
                                onClick={handlePurchase}
                                disabled={isCheckingOut}
                                className="bg-white text-blue-600 px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50"
                            >
                                {isCheckingOut ? '처리 중...' : '전체 리포트 구매하기'}
                            </button>
                        </div>
                    ) : report ? (
                        <div className="space-y-8">
                            {/* Market Fit Analysis */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold mb-4">📊 시장 적합도 분석</h2>
                                <p className="text-gray-700 whitespace-pre-line">{report.marketFitAnalysis}</p>
                            </div>

                            {/* Risk Factors */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold mb-4">⚠️ 리스크 요인</h2>
                                <ul className="space-y-2">
                                    {report.riskFactors.map((risk: string, i: number) => (
                                        <li key={i} className="flex items-start">
                                            <span className="mr-2 text-red-500">•</span>
                                            <span className="text-gray-700">{risk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Salary Prediction */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold mb-4">💰 연봉 예측</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-blue-50 rounded-xl">
                                        <h3 className="font-semibold mb-2">🇦🇺 호주</h3>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ${report.salaryPrediction.australia.min.toLocaleString()} - $
                                            {report.salaryPrediction.australia.max.toLocaleString()} AUD
                                        </p>
                                    </div>
                                    <div className="p-6 bg-purple-50 rounded-xl">
                                        <h3 className="font-semibold mb-2">🇰🇷 한국</h3>
                                        <p className="text-2xl font-bold text-purple-600">
                                            ₩{report.salaryPrediction.korea.min.toLocaleString()} - ₩
                                            {report.salaryPrediction.korea.max.toLocaleString()} KRW
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Skill Gap */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold mb-4">🎯 스킬 갭 분석</h2>
                                <ul className="space-y-2">
                                    {report.skillGapAnalysis.map((skill: string, i: number) => (
                                        <li key={i} className="flex items-start">
                                            <span className="mr-2 text-blue-500">•</span>
                                            <span className="text-gray-700">{skill}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Plan */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold mb-4">🗓️ 90일 액션 플랜</h2>
                                <div className="space-y-4">
                                    {report.actionPlan.map((action: any, i: number) => (
                                        <div
                                            key={i}
                                            className={`p-4 rounded-xl border-l-4 ${action.priority === 'high'
                                                    ? 'border-red-500 bg-red-50'
                                                    : action.priority === 'medium'
                                                        ? 'border-yellow-500 bg-yellow-50'
                                                        : 'border-green-500 bg-green-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold">Day {action.day}: {action.title}</h3>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${action.priority === 'high'
                                                            ? 'bg-red-200 text-red-800'
                                                            : action.priority === 'medium'
                                                                ? 'bg-yellow-200 text-yellow-800'
                                                                : 'bg-green-200 text-green-800'
                                                        }`}
                                                >
                                                    {action.priority}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{action.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Download Button */}
                            <div className="text-center">
                                <button
                                    onClick={() => window.print()}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                                >
                                    📄 PDF로 다운로드
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            <p className="text-gray-600">리포트를 생성하는 중입니다...</p>
                            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
