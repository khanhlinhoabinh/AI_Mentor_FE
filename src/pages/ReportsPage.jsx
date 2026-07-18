
import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../components/layout/Adminlayout";
import StatCard from "../components/admin/StatCard/Statcard";
import ActivityChart from "../components/admin/ActivityChart/Activitychart";
import DetailStats from "../components/admin/DetailStats/Detailstats";
import UserDistribution from "../components/admin/UserDistribution/Userdistribution";
import { getDashboardStatistics, getActivityLogs } from "../services/admin.services";
import { buildWeeklyActivitySeries } from "../utils/activityBadges";

const DAY_OPTIONS = [
  { label: "Hôm nay", value: 1 },
  { label: "3 ngày", value: 3 },
  { label: "7 ngày", value: 7 },
];

/**
 * Báo cáo thống kê — tái sử dụng các chart đã có ở Dashboard
 * (ActivityChart: line, DetailStats: radar, UserDistribution: pie),
 * không tạo biểu đồ mới. Chỉ đổi nguồn dữ liệu + filter Today/3/7 ngày.
 */
export default function ReportsPage() {
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);

  const load = useCallback(async (selectedDays) => {
    try {
      const [dashboard, logs] = await Promise.all([
        getDashboardStatistics(selectedDays),
        getActivityLogs().catch(() => []),
      ]);
      setStats(dashboard);
      setActivityLogs(logs || []);
    } catch (err) {
      console.error("Không thể tải báo cáo thống kê:", err);
    }
  }, []);

  useEffect(() => { load(days); }, [days, load]);

  const statCards = stats
    ? [
        { label: "Users", value: stats.totalUsers ?? 0, percent: "", icon: "users", color: "#2F8F67", bg: "#E8F8F1" },
        { label: "Documents", value: stats.totalDocuments ?? 0, percent: "", icon: "docs", color: "#5B61FF", bg: "#EEEEFF" },
        { label: "Quiz Sets", value: stats.totalQuizSets ?? 0, percent: "", icon: "quiz", color: "#A855F7", bg: "#F3E8FF" },
        { label: "Flashcard Sets", value: stats.totalFlashcardSets ?? 0, percent: "", icon: "chat", color: "#F97316", bg: "#FFF0E6" },
      ]
    : [];

  const pieData = stats
    ? [
        { name: "Users", value: stats.totalUsers ?? 0, color: "#2F8F67" },
        { name: "Documents", value: stats.totalDocuments ?? 0, color: "#5B61FF" },
        { name: "Quiz Sets", value: stats.totalQuizSets ?? 0, color: "#A855F7" },
        { name: "Flashcard Sets", value: stats.totalFlashcardSets ?? 0, color: "#F97316" },
      ]
    : [];

  const radarData = stats
    ? (() => {
        const vals = [stats.totalUsers ?? 0, stats.totalDocuments ?? 0, stats.totalQuizSets ?? 0, stats.totalFlashcardSets ?? 0];
        const max = Math.max(...vals, 1);
        return [
          { subject: "Người dùng", A: Math.round((vals[0] / max) * 100) },
          { subject: "Tài liệu", A: Math.round((vals[1] / max) * 100) },
          { subject: "Quiz", A: Math.round((vals[2] / max) * 100) },
          { subject: "Flashcard", A: Math.round((vals[3] / max) * 100) },
        ];
      })()
    : [];

  const weeklySeries = buildWeeklyActivitySeries(activityLogs);

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", margin: 0 }}>Báo cáo thống kê</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {DAY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid " + (days === opt.value ? "#2F8F67" : "#E5E7EB"),
                background: days === opt.value ? "#2F8F67" : "#fff",
                color: days === opt.value ? "#fff" : "#374151",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        {statCards.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14, marginBottom: 14 }}>
        <ActivityChart data={weeklySeries} />
        <UserDistribution data={pieData} title="Phân bố dữ liệu hệ thống" centerLabel="Tổng bản ghi" />
      </div>

      <DetailStats data={radarData} periodOptions={["Hôm nay", "3 ngày", "7 ngày"]} period={DAY_OPTIONS.find(o => o.value === days)?.label} onPeriodChange={(label) => {
        const found = DAY_OPTIONS.find(o => o.label === label);
        if (found) setDays(found.value);
      }} />
    </AdminLayout>
  );
}
