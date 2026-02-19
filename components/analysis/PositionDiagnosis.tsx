import { PositionDiagnosis } from '@/types';

export default function PositionDiagnosisSection({ data }: { data: PositionDiagnosis }) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">🩺</span> 현재 상태 진단 (Current Position Diagnosis)
            </h2>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                <p className="text-lg text-slate-700 font-medium leading-relaxed">
                    "{data.summary}"
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Stats */}
                <div className="space-y-8">
                    <div>
                        <div className="text-sm text-slate-500 mb-2 font-bold uppercase tracking-wider">Market Alignment Score</div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-bold text-slate-700">🇦🇺 Australia</span>
                                    <span className="text-sm font-black text-[#00C73C]">{data.marketAlignment.australia}/100</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00C73C] rounded-full" style={{ width: `${data.marketAlignment.australia}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-bold text-slate-700">🇰🇷 한국 시장 적합도</span>
                                    <span className="font-bold text-slate-900">{data.marketAlignment.korea}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="h-full bg-slate-400 rounded-full" style={{ width: `${data.marketAlignment.korea}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-slate-500 mb-1 font-bold uppercase tracking-wider">Experience</div>
                            <div className="text-2xl font-black text-slate-900">{data.experienceLevel}</div>
                        </div>
                        {/* Signals */}
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
                            <div className="flex justify-between items-center p-2 border-b border-slate-200 last:border-0">
                                <span className="text-sm text-slate-500 font-bold">기술 스택 깊이</span>
                                <span className="text-sm font-bold text-slate-800">{data.techStack.depth}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-slate-200 last:border-0">
                                <span className="text-sm text-slate-500 font-bold">기술 스택 범위</span>
                                <span className="text-sm font-bold text-slate-800">{data.techStack.breadth}</span>
                            </div>
                            <div className="flex justify-between items-center p-2">
                                <span className="text-sm text-slate-500 font-bold">포트폴리오 경쟁력</span>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${data.portfolioSignal === 'Strong' ? 'bg-[#E8F8EE] text-[#00C73C]' :
                                        data.portfolioSignal === 'Moderate' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {data.portfolioSignal}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Risks */}
                <div className="grid grid-cols-2 gap-4">
                    <RiskCard
                        label="Visa Risk"
                        value={data.visaRisk}
                        color={data.visaRisk === 'High' ? 'bg-red-100 text-red-700' : data.visaRisk === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}
                    />
                    <RiskCard
                        label="Language Risk"
                        value={data.languageRisk}
                        color={data.languageRisk === 'High' ? 'bg-red-100 text-red-700' : data.languageRisk === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}
                    />
                    <RiskCard
                        label="Portfolio Signal"
                        value={data.portfolioSignal}
                        color={data.portfolioSignal === 'Weak' ? 'bg-red-100 text-red-700' : data.portfolioSignal === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}
                    />
                </div>
            </div>
        </div>
    );
}

function RiskCard({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className={`p-4 rounded-xl ${color} flex flex-col justify-center text-center`}>
            <div className="text-xs font-bold opacity-70 mb-1 uppercase">{label}</div>
            <div className="text-lg font-black">{value}</div>
        </div>
    );
}
