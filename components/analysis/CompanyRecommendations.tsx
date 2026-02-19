import { CompanyFit, CompanyRecommendation } from '@/types';

export default function CompanyRecommendationsSection({ data }: { data: CompanyFit }) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">🏢</span> 추천 기업 (Top Company Picks)
            </h2>

            <p className="text-slate-600 mb-8 leading-relaxed">
                {data.conclusion}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Australia Companies */}
                <div>
                    <h3 className="text-lg font-bold text-[#00C73C] mb-4 flex items-center gap-2">
                        <span className="text-xl">🇦🇺</span> Australia Matches
                    </h3>
                    <div className="space-y-4">
                        {data.australia.map((company, i) => (
                            <CompanyCard key={i} company={company} />
                        ))}
                    </div>
                </div>

                {/* Korea Companies */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="text-xl">🇰🇷</span> Korea Matches
                    </h3>
                    <div className="space-y-4">
                        {data.korea.map((company, i) => (
                            <CompanyCard key={i} company={company} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CompanyCard({ company }: { company: CompanyRecommendation }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#00C73C]/50 hover:shadow-md transition-all bg-white group">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl group-hover:bg-[#E8F8EE] group-hover:text-[#00C73C] transition-colors">
                {company.name.charAt(0)}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800">{company.name}</h4>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {company.matchScore}% Match
                    </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                    {company.reason}
                </p>
            </div>
        </div>
    );
}
