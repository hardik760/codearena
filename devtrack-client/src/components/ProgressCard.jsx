import { Trash2, Trophy } from "lucide-react";

const PLATFORM_STYLES = {
    leetcode: {
        label: "LeetCode",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        dot: "bg-amber-400",
    },
    codeforces: {
        label: "Codeforces",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        dot: "bg-blue-400",
    },
    hackerrank: {
        label: "HackerRank",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        dot: "bg-emerald-400",
    },
    codechef: {
        label: "CodeChef",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        dot: "bg-orange-400",
    },
    atcoder: {
        label: "AtCoder",
        color: "text-pink-400",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20",
        dot: "bg-pink-400",
    },
};

function getPlatformStyle(platform) {
    const key = platform?.toLowerCase().replace(/\s+/g, "");
    return PLATFORM_STYLES[key] || {
        label: platform,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
        dot: "bg-violet-400",
    };
}

export default function ProgressCard({ item, onDelete }) {
    const style = getPlatformStyle(item.platform);

    const formattedDate = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "—";

    return (
        <div className="group relative bg-[#111120] border border-white/5 rounded-xl p-5 hover:border-white/10 hover:bg-[#14142a] transition-all duration-300 hover:shadow-lg hover:shadow-black/30">
            {/* Platform Badge */}
            <div className="flex items-center justify-between mb-4">
                <span
                    className={`inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full border ${style.bg} ${style.border} ${style.color}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {item.platform}
                </span>

                {/* Delete Button (visible on hover) */}
                <button
                    onClick={() => onDelete(item._id)}
                    className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-7 h-7 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    title="Delete"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Stats */}
            <div className="flex items-end gap-2 mb-3">
                <div className="flex items-center gap-2">
                    <Trophy size={18} className={style.color} />
                    <span className="text-3xl font-bold text-white leading-none">
                        {item.solved}
                    </span>
                </div>
                <span className="text-white/30 text-sm mb-0.5">problems solved</span>
            </div>

            {/* Date */}
            <p className="text-white/25 text-xs">{formattedDate}</p>

            {/* Subtle gradient accent at bottom */}
            <div
                className={`absolute bottom-0 left-0 right-0 h-px rounded-b-xl opacity-50 bg-gradient-to-r from-transparent ${style.dot} to-transparent`}
            />
        </div>
    );
}
