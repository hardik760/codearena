export default function StatCard({ icon: Icon, label, value, color = "violet" }) {
    const colorMap = {
        violet: {
            icon: "text-violet-400",
            bg: "bg-violet-500/10",
            border: "border-violet-500/20",
            glow: "shadow-violet-500/10",
        },
        emerald: {
            icon: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            glow: "shadow-emerald-500/10",
        },
        amber: {
            icon: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            glow: "shadow-amber-500/10",
        },
        blue: {
            icon: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            glow: "shadow-blue-500/10",
        },
    };

    const c = colorMap[color] || colorMap.violet;

    return (
        <div
            className={`bg-[#111120] border ${c.border} rounded-xl p-5 flex items-center gap-4 shadow-lg ${c.glow}`}
        >
            <div className={`p-3 rounded-xl ${c.bg} ${c.border} border`}>
                <Icon size={20} className={c.icon} />
            </div>
            <div>
                <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                    {label}
                </p>
                <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
            </div>
        </div>
    );
}
