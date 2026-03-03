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
import Heatmap from "../components/Heatmap";
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

  const github = stats?.github?.stats || {};
  const leetcode = stats?.leetcode?.stats || {};
  const codeforces = stats?.codeforces?.stats || {};

  return (
    <Layout title="Developer Analytics">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Unified Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Trophy}
            label="LeetCode Solved"
            value={leetcode.totalSolved || 0}
            color="amber"
          />
          <StatCard
            icon={Activity}
            label="CF Max Rating"
            value={codeforces.maxRating || 0}
            color="emerald"
          />
          <StatCard
            icon={Github}
            label="GitHub Repos"
            value={github.public_repos || 0}
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
              title="Coding Activity Trend"
              data={[
                { name: "Mon", value: 12 },
                { name: "Tue", value: 19 },
                { name: "Wed", value: 3 },
                { name: "Thu", value: 5 },
                { name: "Fri", value: 2 },
                { name: "Sat", value: 3 },
                { name: "Sun", value: 10 },
              ]}
            />
          </div>

          {/* Platform Distribution Card */}
          <div className="bg-[#111120] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-white font-semibold text-lg mb-6">Skill Breakdown</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>Logic & Data Structures</span>
                  <span>{Math.round((leetcode.totalSolved / 500) * 100) || 0}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500/60 rounded-full" style={{ width: `${(leetcode.totalSolved / 500) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>Competitive Coding</span>
                  <span>{Math.round((codeforces.rating / 2000) * 100) || 0}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${(codeforces.rating / 2000) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>System Design & Projects</span>
                  <span>{Math.round((github.public_repos / 50) * 100) || 0}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500/60 rounded-full" style={{ width: `${(github.public_repos / 50) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <Heatmap color="violet" />

      </div>
    </Layout>
  );
}