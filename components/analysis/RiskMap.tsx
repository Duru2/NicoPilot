import { RiskItem } from '@/types';

export default function RiskMapSection({ risks }: { risks: RiskItem[] }) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">⚠️</span> 리스크 지도 (Risk Map)
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {risks.map((item, index) => (
                    <div
                        key={index}
                        className={`p-5 rounded-2xl border-l-4 shadow-sm transition-transform hover:scale-[1.02] ${item.color === 'red' ? 'bg-red-50 border-red-500' :
                                item.color === 'yellow' ? 'bg-yellow-50 border-yellow-500' :
                                    'bg-green-50 border-green-500'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${item.color === 'red' ? 'bg-red-200 text-red-800' :
                                    item.color === 'yellow' ? 'bg-yellow-200 text-yellow-800' :
                                        'bg-green-200 text-green-800'
                                }`}>
                                {item.severity} Risk
                            </span>
                            <span className="text-xs text-slate-400 font-bold uppercase">{item.category}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 leading-snug">
                            {item.risk}
                        </h4>
                    </div>
                ))}
            </div>

            <p className="text-center text-slate-400 text-sm mt-6 font-medium">
                * Red risks must be addressed before applying for visa sponsorship.
            </p>
        </div>
    );
}
