import { VisaAnalysis, VisaPathway } from '@/types';

export default function VisaAnalysisSection({ data }: { data: VisaAnalysis }) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">🛂</span> 비자 승인 가능성 진단 (Visa Assessment)
            </h2>

            <div className="flex items-center gap-4 p-5 bg-[#E8F8EE] rounded-2xl border border-green-100 mb-8">
                <div className="text-4xl">🐨</div>
                <div>
                    <div className="font-bold text-[#004d17] text-lg">Australia Visa Strategy</div>
                    <p className="text-[#00C73C] text-sm">{data.recommendation}</p>
                </div>
            </div>

            <div className="space-y-6">
                {data.pathways.map((pathway, index) => (
                    <VisaPathwayCard key={index} pathway={pathway} />
                ))}
            </div>
        </div>
    );
}

function VisaPathwayCard({ pathway }: { pathway: VisaPathway }) {
    const isHigh = pathway.eligibility === 'High';
    const isMedium = pathway.eligibility === 'Medium';

    return (
        <div className={`border rounded-2xl p-6 transition-all ${isHigh ? 'border-green-200 bg-[#E8F8EE]/30' : 'border-slate-200 bg-white hover:border-[#00C73C]/30'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-slate-900 text-white text-xs font-bold rounded">{pathway.subclass}</span>
                        <h3 className="font-bold text-lg text-slate-800">{pathway.name}</h3>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">{pathway.strategy}</p>
                </div>

                <div className="shrink-0">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border ${isHigh ? 'bg-green-100 text-green-700 border-green-200' :
                        isMedium ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                        Eligibility: {pathway.eligibility}
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-slate-100">
                <div>
                    <h4 className="text-xs font-bold text-green-600 uppercase mb-2">✅ PROS</h4>
                    <ul className="space-y-1">
                        {pathway.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-green-500">•</span> {pro}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-red-500 uppercase mb-2">⚠️ RISKS</h4>
                    <ul className="space-y-1">
                        {pathway.cons.map((con, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-red-400">•</span> {con}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
