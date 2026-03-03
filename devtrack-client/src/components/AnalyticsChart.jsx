import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsChart({ data = [], title = "Performance Over Time" }) {
    return (
        <div className="bg-[#111120] border border-white/5 rounded-2xl p-6 shadow-xl h-96">
            <h3 className="text-white font-semibold text-lg mb-6">{title}</h3>
            <div className="w-full h-[calc(100%-40px)]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#ffffff40"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#ffffff40"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{ background: "#111120", border: "1px solid #ffffff10", borderRadius: "12px" }}
                            itemStyle={{ color: "#fff" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
