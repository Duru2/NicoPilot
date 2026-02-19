import { ExecutionPlan, ExecutionStep } from '@/types';

export default function ExecutionPlanSection({ plan }: { plan: ExecutionPlan }) {
    return (
        <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white mb-8 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C73C] rounded-full mix-blend-overlay filter blur-3xl opacity-10 pointer-events-none"></div>

            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 relative z-10">
                <span className="text-3xl">📅</span> 90-Day Execution Plan (합격 플랜)
            </h2>

            <div className="space-y-8 relative z-10">
                <MonthBlock
                    month="Month 1"
                    title="Stabilize & Position"
                    focus={plan.month1.focus}
                    steps={plan.month1.steps}
                    color="from-emerald-500 to-green-500"
                />
                <MonthBlock
                    month="Month 2"
                    title="Market Penetration"
                    focus={plan.month2.focus}
                    steps={plan.month2.steps}
                    color="from-teal-500 to-emerald-500"
                />
                <MonthBlock
                    month="Month 3"
                    title="Leverage & Convert"
                    focus={plan.month3.focus}
                    steps={plan.month3.steps}
                    color="from-green-500 to-lime-500"
                />
            </div>
        </div>
    );
}

function MonthBlock({ month, title, focus, steps, color }: { month: string, title: string, focus: string, steps: ExecutionStep[], color: string }) {
    return (
        <div className="relative pl-6 md:pl-0">
            {/* Timeline for Desktop */}
            <div className="hidden md:block absolute left-[150px] top-0 bottom-0 w-px bg-slate-700"></div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Month Header */}
                <div className="md:w-[150px] shrink-0 flex flex-col relative z-10">
                    <div className={`text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${color} mb-1`}>
                        {month}
                    </div>
                    <div className="text-xl font-bold text-white mb-2">{title}</div>
                    <div className="text-xs text-slate-400 font-medium bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                        Focus: {focus}
                    </div>
                </div>

                {/* Steps */}
                <div className="flex-1 grid gap-4">
                    {steps.map((step, i) => (
                        <div key={i} className="bg-slate-800/50 hover:bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-[#00C73C]/50 transition-all group">
                            <div className="flex items-start gap-4">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0 mt-0.5`}>
                                    {step.week ? `W${step.week}` : i + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{step.task}</h4>
                                    {step.description && (
                                        <p className="text-sm text-slate-500 mt-1 group-hover:text-slate-400">{step.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
