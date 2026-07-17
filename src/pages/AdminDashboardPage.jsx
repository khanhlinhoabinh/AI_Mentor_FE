import { useEffect, useState, useCallback } from "react";
import styles from "../styles/admin/AdminDashboard.module.css";
import AdminLayout from "../components/layout/Adminlayout";
import StatCard from "../components/admin/StatCard/Statcard";
import SystemOverview from "../components/admin/SystemOverview/Systemoverview";
import ActivityChart from "../components/admin/ActivityChart/Activitychart";
import AlertPanel from "../components/admin/AlertPanel/Alertpanel";
import RecentActivity from "../components/admin/RecentActivity/Recentactivity";
import SummaryStats from "../components/admin/SummaryStats/Summarystats";
import PopularCourses from "../components/admin/PopularCourses/Popularcourses";
import DetailStats from "../components/admin/DetailStats/Detailstats";
import UserDistribution from "../components/admin/UserDistribution/Userdistribution";

import {
  getDashboardStatistics,
  getTotalLoggedUsers,
  getTotalDocuments,
  getUsers,
  getActivityLogs,
} from "../services/admin.services";
import { buildWeeklyActivitySeries } from "../utils/activityBadges";

const DAY_OPTIONS = [
  { label: "Hôm nay", value: 1 },
  { label: "3 ngày", value: 3 },
  { label: "7 ngày", value: 7 },
];

function DaysFilter({ value, onChange }) {
  // Bộ lọc Today / 3 Days / 7 Days theo yêu cầu Product Owner.
  // Được thêm mới, không sửa đổi bất kỳ class/layout nào đang có.
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: -4 }}>
      {DAY_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid " + (value === opt.value ? "#2F8F67" : "#E5E7EB"),
            background: value === opt.value ? "#2F8F67" : "#fff",
            color: value === opt.value ? "#fff" : "#374151",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all .15s ease",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function HeroSection({ statCards }) {
  return (
    <div className={styles.heroGrid}>
      <div className={styles.heroCard}>
        <div className={styles.heroGlow} />
        <div className={styles.heroIllustration}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
          <div className={styles.heroPlant}>
            <svg width="120" height="130" viewBox="0 0 120 130" fill="none">
              <ellipse cx="60" cy="118" rx="38" ry="9" fill="rgba(47,143,103,0.15)" />
              <rect x="56" y="60" width="8" height="58" rx="4" fill="#2F8F67" opacity="0.7" />
              <path d="M60 82 Q40 66 28 46 Q50 52 60 72" fill="#2F8F67" opacity="0.85" />
              <path d="M60 72 Q80 56 92 36 Q70 44 60 66" fill="#53B88B" opacity="0.85" />
              <path d="M60 92 Q33 81 20 60 Q44 66 60 84" fill="#2F8F67" opacity="0.65" />
              <circle cx="60" cy="38" r="20" fill="rgba(47,143,103,0.12)" stroke="#2F8F67" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="60" cy="38" r="11" fill="rgba(47,143,103,0.2)" />
              <circle cx="60" cy="38" r="5" fill="#2F8F67" />
              <circle cx="28" cy="98" r="7" fill="rgba(255,255,255,0.07)" stroke="rgba(83,184,139,0.4)" strokeWidth="1" />
              <circle cx="92" cy="88" r="5" fill="rgba(255,255,255,0.07)" stroke="rgba(83,184,139,0.3)" strokeWidth="1" />
              <circle cx="20" cy="60" r="4" fill="rgba(83,184,139,0.2)" />
              <circle cx="100" cy="55" r="3" fill="rgba(83,184,139,0.2)" />
            </svg>
          </div>
        </div>
      </div>
      {statCards.map((s, i) => (
        <StatCard key={i} {...s} />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [days, setDays] = useState(7);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [totalUsersAllTime, setTotalUsersAllTime] = useState(null);
  const [totalDocsAllTime, setTotalDocsAllTime] = useState(null);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async (selectedDays) => {
    try {
      const data = await getDashboardStatistics(selectedDays);
      setDashboardStats(data);
    } catch (err) {
      console.error("Không thể tải dữ liệu dashboard:", err);
    }
  }, []);

  useEffect(() => {
    loadDashboard(days);
  }, [days, loadDashboard]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const [usersTotal, docsTotal, users, logs] = await Promise.all([
          getTotalLoggedUsers().catch(() => null),
          getTotalDocuments().catch(() => null),
          getUsers().catch(() => []),
          getActivityLogs().catch(() => []),
        ]);

        if (!mounted) return;

        setTotalUsersAllTime(usersTotal?.total ?? null);
        setTotalDocsAllTime(docsTotal?.total ?? null);
        setActivityLogs(logs || []);

        // Phân bố role thật, tính từ danh sách user (GET /admin/users)
        const counts = {};
        (users || []).forEach((u) => {
          const role = u.role || "Khác";
          counts[role] = (counts[role] || 0) + 1;
        });
        setRoleDistribution(
          Object.entries(counts).map(([name, value]) => ({ name, value }))
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const statCards = dashboardStats
    ? [
        { label: "Total Users", value: dashboardStats.totalUsers ?? 0, percent: "", icon: "users", color: "#2F8F67", bg: "#E8F8F1" },
        { label: "Total Documents", value: dashboardStats.totalDocuments ?? 0, percent: "", icon: "docs", color: "#5B61FF", bg: "#EEEEFF" },
        { label: "Total Quiz Sets", value: dashboardStats.totalQuizSets ?? 0, percent: "", icon: "quiz", color: "#A855F7", bg: "#F3E8FF" },
        { label: "Total Flashcard Sets", value: dashboardStats.totalFlashcardSets ?? 0, percent: "", icon: "chat", color: "#F97316", bg: "#FFF0E6" },
      ]
    : [];

  const summaryStatsData = [
    { key: "users", label: "Tổng người dùng", value: totalUsersAllTime, color: "#2F8F67", bg: "#E8F8F1" },
    { key: "docs", label: "Tổng tài liệu", value: totalDocsAllTime, color: "#2F8F67", bg: "#E8F8F1" },
    // Chưa có API cho tổng môn học / tổng lượt học -> hiển thị "—" thay vì hard-code.
    { key: "subjects", label: "Tổng môn học", value: null, color: "#5B61FF", bg: "#EEEEFF" },
    { key: "activity", label: "Tổng lượt học", value: null, color: "#F97316", bg: "#FFF0E6" },
  ];

  const detailStatsData = dashboardStats
    ? (() => {
        const vals = [
          dashboardStats.totalUsers ?? 0,
          dashboardStats.totalDocuments ?? 0,
          dashboardStats.totalQuizSets ?? 0,
          dashboardStats.totalFlashcardSets ?? 0,
        ];
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
      <div className={styles.pageOuter}>
        {/* Center content */}
        <div className={styles.centerCol}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <DaysFilter value={days} onChange={setDays} />
            {loading && <span style={{ fontSize: 12, color: "#9CA3AF" }}>Đang tải dữ liệu...</span>}
          </div>

          <HeroSection statCards={statCards} />

          <div className={styles.middleRow}>
            <div className={styles.middleLeft}>
              <SystemOverview />
            </div>
            <div className={styles.middleRight}>
              <ActivityChart data={weeklySeries} />
            </div>
          </div>

          <SummaryStats stats={summaryStatsData} />

          <div className={styles.bottomRow}>
            <div className={styles.bottomLeft}>
              <PopularCourses />
            </div>
            <div className={styles.bottomMid}>
              <DetailStats data={detailStatsData} />
            </div>
            <div className={styles.bottomRight}>
              <UserDistribution data={roleDistribution} />
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className={styles.rightCol}>
          <AlertPanel />
          <RecentActivity activities={activityLogs} />
        </div>
      </div>
    </AdminLayout>
  );
}
