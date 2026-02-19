import { SkillGap } from '@/types';
import { useState } from 'react';

export default function SkillRoadmapSection({ australia, korea }: { australia: SkillGap, korea: SkillGap }) {
    const [activeTab, setActiveTab] = useState<'australia' | 'korea'>('australia');
    const data = activeTab === 'australia' ? australia : korea;

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] border border-slate-200 mb-8 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00C73C] rounded-lg flex items-center justify-center text-xl shadow-sm text-white">
                        📈
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">커리어 성장 로드맵</h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Skill Gap Analysis & Roadmap</p>
                    </div>
                </div>

                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm self-start md:self-auto">
                    <button
                        onClick={() => setActiveTab('australia')}
                        className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'australia' ? 'bg-[#00C73C] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                    >
                        🇦🇺 Australia
                    </button>
                    <button
                        onClick={() => setActiveTab('korea')}
                        className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'korea' ? 'bg-[#00C73C] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                    >
                        🇰🇷 Korea
                    </button>
                </div>
            </div>

            <div className="p-8 grid lg:grid-cols-12 gap-10">
                {/* Missing Skills (Left Panel) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-5 bg-red-50 rounded-xl border border-red-100">
                        <h3 className="text-sm font-bold text-red-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-red-600"></span>
                            Critical Missing Skills
                        </h3>
                        <ul className="space-y-3">
                            {data.missingSkills.map((skill, i) => (
                                <li key={i} className="flex gap-3 text-slate-700 text-sm font-semibold bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                    <span className="text-red-500">⚠️</span>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="text-sm text-slate-500 leading-relaxed px-2">
                        * 위 스킬들은 해당 시장에서 상위 20% 연봉 구간으로 진입하기 위해 가장 시급하게 보완해야 할 역량입니다.
                    </div>
                </div>

                {/* Staircase Roadmap (Right Panel) */}
                <div className="lg:col-span-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="text-[#00C73C]">Step-by-Step</span> Growth Plan
                    </h3>

                    <div className="relative space-y-2">
                        {/* Vertical Guide Line */}
                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100 dashed"></div>

                        {data.roadmap.map((step, i) => (
                            <div
                                key={i}
                                className="relative flex items-center transform transition-all hover:scale-[1.01]"
                                style={{ marginLeft: `${i * 2.5}rem` }} // Staircase effect
                            >
                                {/* Connector curve for staircase effect */}
                                {i > 0 && (
                                    <div className="absolute -left-6 top-1/2 w-6 h-0.5 bg-slate-200"></div>
                                )}
                                {i > 0 && (
                                    <div className="absolute -left-6 top-0 bottom-1/2 w-0.5 bg-slate-200"></div>
                                )}

                                <div className="z-10 flex-shrink-0 w-8 h-8 rounded-full bg-[#00C73C] text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white ring-1 ring-green-100">
                                    {i + 1}
                                </div>

                                <div className="ml-4 flex-grow p-4 bg-white rounded-r-xl rounded-bl-xl border-l-4 border-l-[#00C73C] border-y border-r border-slate-200 shadow-sm group hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-[#00C73C] uppercase tracking-wider">Level {i + 1}</span>
                                    </div>
                                    <p className="text-slate-800 font-semibold">{step}</p>
                                </div>
                            </div>
                        ))}

                        {/* Goal Flag */}
                        <div className="relative flex items-center mt-4" style={{ marginLeft: `${data.roadmap.length * 2.5}rem` }}>
                            <div className="absolute -left-6 top-1/2 w-6 h-0.5 bg-slate-200"></div>
                            <div className="absolute -left-6 top-0 bottom-1/2 w-0.5 bg-slate-200"></div>
                            <div className="z-10 flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                                🏆
                            </div>
                            <div className="ml-4 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg shadow-md text-sm font-bold">
                                Market Leader 도달
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
