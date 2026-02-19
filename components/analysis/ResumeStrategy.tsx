import { ResumeStrategy } from '@/types';

export default function ResumeStrategySection({ strategy }: { strategy: ResumeStrategy }) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">📄</span> 이력서 전략 (Resume Strategy)
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Australia Strategy */}
                <div className="bg-[#E8F8EE]/50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🇦🇺</span>
                        <h3 className="font-bold text-[#004d17] text-lg">For Australia</h3>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-[#00C73C] uppercase mb-2 tracking-wider">Key Focus Areas</h4>
                        <div className="flex flex-wrap gap-2">
                            {strategy.australia.focus.map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-white text-[#00C73C] rounded-lg text-sm font-bold shadow-sm border border-green-100">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-[#00C73C] uppercase mb-2 tracking-wider">Actionable Checklist</h4>
                        <ul className="space-y-3">
                            {strategy.australia.checklist.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-[#00C73C] flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-2.5 h-2.5 bg-[#00C73C] rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"></div>
                                    </div>
                                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Korea Strategy */}
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🇰🇷</span>
                        <h3 className="font-bold text-slate-900 text-lg">For Korea</h3>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Key Focus Areas</h4>
                        <div className="flex flex-wrap gap-2">
                            {strategy.korea.focus.map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-white text-slate-600 rounded-lg text-sm font-bold shadow-sm border border-slate-200">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Actionable Checklist</h4>
                        <ul className="space-y-3">
                            {strategy.korea.checklist.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-2.5 h-2.5 bg-slate-500 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"></div>
                                    </div>
                                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
