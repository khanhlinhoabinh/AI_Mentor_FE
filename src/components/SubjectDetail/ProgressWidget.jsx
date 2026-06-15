import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp } from "lucide-react";
import "./ProgressWidget.css";

const PERIODS = ["Tuần này", "Tháng này"];

export default function ProgressWidget({ chartData }) {
  const [period, setPeriod] = useState("Tuần này");

  return (
    <div className="pw-widget">
      <div className="pw-header">
        <h2 className="pw-title">Tiến độ học tập</h2>
        <select
          className="pw-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          {PERIODS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="pw-chart-wrap">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 12 }}
              formatter={(v) => [`${v}%`, "Tiến độ"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2.5}
              fill="url(#greenGrad)"
              dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#22c55e" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pw-summary">
        <TrendingUp size={14} className="pw-trend-icon" />
        <span className="pw-summary-text">
          Bạn đã học <strong>6.5h</strong> trong tuần này
        </span>
      </div>
      <div className="pw-growth">
        📈 Tăng 15% so với tuần trước đó
      </div>
    </div>
  );
}