import { MarketComparison } from '@/types';

export default function MarketComparisonSection({ data }: { data: MarketComparison }) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">⚖️</span> 한국 vs 호주 현실 비교 (Market Comparison)
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-100">
                            <th className="py-4 px-4 text-slate-400 font-bold uppercase tracking-wider text-sm w-1/4">항목 (Criteria)</th>
                            <th className="py-4 px-4 text-slate-900 font-black text-lg w-1/3">Australia 🇦🇺</th>
                            <th className="py-4 px-4 text-slate-900 font-black text-lg w-1/3">Korea 🇰🇷</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-4 font-bold text-slate-600">평균 연봉 (Salary)</td>
                            <td className="py-5 px-4">
                                <span className="font-bold text-blue-600">
                                    ${data.salary.australia.min.toLocaleString()} - ${data.salary.australia.max.toLocaleString()} AUD
                                </span>
                            </td>
                            <td className="py-5 px-4">
                                <span className="font-bold text-slate-600">
                                    ₩{(data.salary.korea.min / 10000).toLocaleString()}만 - ₩{(data.salary.korea.max / 10000).toLocaleString()}만원
                                </span>
                            </td>
                        </tr>
                        <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-4 font-bold text-slate-600">기술 트렌드 (Tech)</td>
                            <td className="py-5 px-4 text-sm">{data.trends.australia.join(', ')}</td>
                            <td className="py-5 px-4 text-sm">{data.trends.korea.join(', ')}</td>
                        </tr>
                        <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-4 font-bold text-slate-600">채용 경쟁도 (Competition)</td>
                            <td className="py-5 px-4">
                                <Badge value={data.competition.australia} type="inverse" />
                            </td>
                            <td className="py-5 px-4">
                                <Badge value={data.competition.korea} type="inverse" />
                            </td>
                        </tr>
                        <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-4 font-bold text-slate-600">외국인 진입장벽 (Barrier)</td>
                            <td className="py-5 px-4">
                                <Badge value={data.visaBarrier} type="risk" />
                            </td>
                            <td className="py-5 px-4">
                                <Badge value="Low" type="safe" /> <span className="text-xs text-slate-400 ml-1">(Native)</span>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-4 font-bold text-slate-600">워라밸 (WLB)</td>
                            <td className="py-5 px-4">
                                <Badge value={data.workLifeBalance.australia} type="positive" />
                            </td>
                            <td className="py-5 px-4">
                                <Badge value={data.workLifeBalance.korea} type="positive" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white shadow-lg">
                <div className="flex items-start gap-4">
                    <span className="text-3xl">💡</span>
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-yellow-400">Strategic Verdict</h4>
                        <p className="leading-relaxed text-slate-200">
                            {data.conclusion}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ value, type }: { value: string, type: 'positive' | 'negative' | 'risk' | 'safe' | 'inverse' }) {
    let colorClass = 'bg-slate-100 text-slate-600';

    if (type === 'positive') {
        if (value === 'High') colorClass = 'bg-[#E8F8EE] text-[#00C73C]';
        else if (value === 'Medium') colorClass = 'bg-blue-50 text-blue-600';
        else colorClass = 'bg-slate-100 text-slate-500';
    } else if (type === 'risk') {
        if (value === 'High') colorClass = 'bg-red-50 text-red-600';
        else if (value === 'Medium') colorClass = 'bg-orange-50 text-orange-600';
        else colorClass = 'bg-[#E8F8EE] text-[#00C73C]'; // Low barrier is good
    } else if (type === 'inverse') {
        // High competition is bad/red
        if (value === 'High') colorClass = 'bg-red-50 text-red-600';
        else if (value === 'Medium') colorClass = 'bg-yellow-50 text-yellow-600';
        else colorClass = 'bg-[#E8F8EE] text-[#00C73C]';
    } else if (type === 'safe') {
        colorClass = 'bg-[#E8F8EE] text-[#00C73C]';
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-transparent ${colorClass}`}>
            {value}
        </span>
    );
}
