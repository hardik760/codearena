export default function Heatmap({ data = [], color = "violet" }) {
    const colorMap = {
        violet: "bg-violet-500/20 hover:bg-violet-500/40",
        emerald: "bg-emerald-500/20 hover:bg-emerald-500/40",
        amber: "bg-amber-500/20 hover:bg-amber-500/40",
    };

    const activeColor = colorMap[color] || colorMap.violet;

    // Generate 52 weeks x 7 days grid
    const cells = Array.from({ length: 364 }).map((_, i) => ({
        id: i,
        intensity: Math.random() > 0.8 ? Math.floor(Math.random() * 4) + 1 : 0
    }));

    const intensityMap = {
        0: "bg-white/5",
        1: "bg-violet-500/20",
        2: "bg-violet-500/40",
        3: "bg-violet-500/60",
        4: "bg-violet-500/80",
    };

    return (
        <div className="bg-[#111120] border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg text-lg">Activity Heatmap</h3>
                <div className="flex items-center gap-2 text-xs text-white/40">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-white/5 rounded-sm" />
                        <div className="w-3 h-3 bg-violet-500/20 rounded-sm" />
                        <div className="w-3 h-3 bg-violet-500/40 rounded-sm" />
                        <div className="w-3 h-3 bg-violet-500/60 rounded-sm" />
                        <div className="w-3 h-3 bg-violet-500/80 rounded-sm" />
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
                {cells.map((cell) => (
                    <div
                        key={cell.id}
                        className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 ${intensityMap[cell.intensity]}`}
                        title={`Activity intensity: ${cell.intensity}`}
                    />
                ))}
            </div>
        </div>
    );
}
