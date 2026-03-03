import { useState, useEffect } from "react";
import {
  BarChart3,
  Github,
  Code,
  Trophy,
  Users,
  FileText,
  Briefcase,
  Settings,
  Activity,
  Target,
  Zap
} from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";
import { getDeveloperStats } from "../lib/analytics";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDeveloperStats();
        setStats(data);
      } catch (err) {
        toast.error("Failed to fetch coding stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <Layout title="Dashboard">
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="h-96 bg-white/5 rounded-2xl w-full" />
      </div>
    </Layout>
  );

  const github = stats?.github || {};
  const leetcode = stats?.leetcode || {};
  const codeforces = stats?.codeforces || {};
  const unifiedHeatmap = stats?.unifiedHeatmap || [];

  const hasData = stats?.github || stats?.leetcode || stats?.codeforces || unifiedHeatmap.length > 0;

  if (!hasData) return (
    <Layout title="Developer Analytics">
      <div className="max-w-3xl mx-auto mt-20 text-center space-y-6 bg-[#111120] border border-white/5 rounded-2xl p-10 shadow-xl">
        <div className="w-16 h-16 bg-violet-500/20 text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Settings size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white">No Analytics Data Found</h2>
        <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
          We couldn't fetch any coding data. This could be because your handles are incorrect, or the external platforms (GitHub, LeetCode, Codeforces) are temporarily rate-limiting requests.
        </p>
        <div className="pt-4">
          <a href="/settings" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-violet-600 hover:bg-violet-500 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]">
            Configure Handles
          </a>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout title="Developer Analytics">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Unified Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Trophy}
            label="LeetCode Solved"
            value={leetcode.totalSolved || "-"}
            color="amber"
          />
          <StatCard
            icon={Activity}
            label="CF Max Rating"
            value={codeforces.maxRating || "-"}
            color="emerald"
          />
          <StatCard
            icon={Github}
            label="GitHub Repos"
            value={github.public_repos || "-"}
            color="violet"
          />
          <StatCard
            icon={Zap}
            label="Consistency Score"
            value={`${stats?.consistencyScore || 0}%`}
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Performance Graph */}
          <div className="lg:col-span-2">
            <AnalyticsChart
              title="Coding Activity Trend (Last 7 Days)"
              data={
                // Extract last 7 days from heatmap if available
                unifiedHeatmap.length >= 7
                  ? unifiedHeatmap.slice(-7).map(day => ({
                    name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    value: day.total
                  }))
                  : [
                    { name: "Mon", value: 0 },
                    { name: "Tue", value: 0 },
                    { name: "Wed", value: 0 },
                    { name: "Thu", value: 0 },
                    { name: "Fri", value: 0 },
                    { name: "Sat", value: 0 },
                    { name: "Sun", value: 0 },
                  ]
              }
            />
          </div>

          {/* Platform Distribution Card */}
          <div className="bg-[#111120] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-white font-semibold text-lg mb-6">Skill Breakdown</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>Logic & Data Structures</span>
                  <span>{Math.round(((leetcode.totalSolved || 0) / 1000) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500/60 rounded-full" style={{ width: `${Math.min(((leetcode.totalSolved || 0) / 1000) * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>Competitive Coding</span>
                  <span>{Math.round(((codeforces.rating || 0) / 3000) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${Math.min(((codeforces.rating || 0) / 3000) * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>System Design & Projects</span>
                  <span>{Math.round(((github.public_repos || 0) / 100) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500/60 rounded-full" style={{ width: `${Math.min(((github.public_repos || 0) / 100) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="bg-[#111120] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg">Unified Activity Heatmap</h3>
            <div className="flex items-center space-x-2 text-xs text-white/40">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-sm bg-white/5" />
                <div className="w-3 h-3 rounded-sm bg-violet-500/20" />
                <div className="w-3 h-3 rounded-sm bg-violet-500/40" />
                <div className="w-3 h-3 rounded-sm bg-violet-500/60" />
                <div className="w-3 h-3 rounded-sm bg-violet-500/80" />
                <div className="w-3 h-3 rounded-sm bg-violet-500" />
              </div>
              <span>More</span>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-4 scrollbar-hide" style={{ direction: 'rtl' }}>
            <div className="flex gap-1" style={{ direction: 'ltr' }}>
              {/* Generate the 365 days grid from the unified response */}
              {Array.from({ length: 52 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dataIndex = (weekIndex * 7) + dayIndex;
                    // Pad start if heatmap is shorter than 365
                    const paddingOffset = 364 - unifiedHeatmap.length;
                    const heatNode = dataIndex >= paddingOffset ? unifiedHeatmap[dataIndex - paddingOffset] : null;

                    let bgClass = "bg-white/5"; // intensity 0
                    if (heatNode) {
                      if (heatNode.intensity === 1) bgClass = "bg-violet-500/30";
                      if (heatNode.intensity === 2) bgClass = "bg-violet-500/50";
                      if (heatNode.intensity === 3) bgClass = "bg-violet-500/80";
                      if (heatNode.intensity === 4) bgClass = "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]";
                    }

                    return (
                      <div
                        key={dayIndex}
                        className={`w-3.5 h-3.5 rounded-sm ${bgClass} transition-all duration-300 hover:scale-125 cursor-crosshair group relative`}
                      >
                        {heatNode && (
                          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs whitespace-nowrap px-3 py-2 rounded-lg z-10 font-mono shadow-2xl border border-white/10 pointer-events-none">
                            <div className="text-white/60 mb-1">{heatNode.date}</div>
                            {heatNode.leetcode > 0 && <div className="text-amber-500">LC: {heatNode.leetcode}</div>}
                            {heatNode.codeforces > 0 && <div className="text-emerald-500">CF: {heatNode.codeforces}</div>}
                            {heatNode.github > 0 && <div className="text-violet-400">GH: {heatNode.github}</div>}
                            <div className="font-bold border-t border-white/10 mt-1 pt-1">Total: {heatNode.total}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}