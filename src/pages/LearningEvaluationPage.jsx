import { useState, useEffect, useCallback } from "react";
import {
  Brain, Sparkles, RefreshCw, Clock, ClipboardList, Layers,
  Map, AlertTriangle, Flame, CheckCircle2, Lightbulb, TrendingUp,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { getWeeklyEvaluation } from "../services/learningEvaluation.services";
import "../styles/LearningEvaluationPage.css";

const CACHE_KEY = "lev_last_evaluation";

const PERIODS = [
  { days: 7, label: "7 ngày" },
  { days: 14, label: "14 ngày" },
  { days: 30, label: "30 ngày" },
];

const STATUS_CONFIG = {
  ON_TRACK: { label: "Đang giữ vững phong độ", color: "#16A34A", bg: "#ECFDF3", ring: "#22C55E" },
  NEEDS_ATTENTION: { label: "Cần chú ý nhịp học", color: "#B45309", bg: "#FFFBEB", ring: "#F59E0B" },
  INACTIVE: { label: "Chưa có hoạt động đáng kể", color: "#64748B", bg: "#F8FAFC", ring: "#94A3B8" },
};

function ScoreRing({ score, color }) {
  const angle = Math.max(0, Math.min(100, score || 0)) * 3.6;
  return (
    <div
      className="lev-score-ring"
      style={{ background: `conic-gradient(${color} ${angle}deg, #E2E8F0 ${angle}deg)` }}
    >
      <div className="lev-score-ring-inner">
        <span className="lev-score-value">{score ?? 0}</span>
        <span className="lev-score-unit">/ 100</span>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, color, title, rows }) {
  return (
    <div className="lev-metric-card">
      <div className="lev-metric-icon" style={{ background: color + "1A", color }}>
        <Icon size={18} />
      </div>
      <div className="lev-metric-body">
        <span className="lev-metric-title">{title}</span>
        <div className="lev-metric-rows">
          {rows.map((r, i) => (
            <div key={i} className="lev-metric-row">
              <span className="lev-metric-row-label">{r.label}</span>
              <span className="lev-metric-row-value">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListCard({ icon: Icon, color, title, items, emptyText }) {
  return (
    <div className="lev-list-card">
      <div className="lev-list-header">
        <Icon size={16} color={color} />
        <span style={{ color }}>{title}</span>
      </div>
      {items && items.length > 0 ? (
        <ul className="lev-list">
          {items.map((item, i) => (
            <li key={i} className="lev-list-item">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="lev-list-empty">{emptyText}</p>
      )}
    </div>
  );
}

function formatTimestamp(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function LearningEvaluationPage() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (selectedDays) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWeeklyEvaluation(selectedDays);
      const now = Date.now();

      setData(res);
      setFetchedAt(now);

      // Lưu lại kết quả để lần sau chuyển vào tab này không phải chờ gọi API nữa
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ days: selectedDays, data: res, fetchedAt: now })
      );
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải đánh giá học tập.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Vào trang: ưu tiên hiện NGAY kết quả đã lưu từ lần trước (không gọi API).
  // Chỉ gọi API nếu chưa từng có đánh giá nào trong phiên làm việc này.
  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setData(parsed.data);
        setDays(parsed.days);
        setFetchedAt(parsed.fetchedAt);
        setLoading(false);
        return;
      } catch {
        // Cache hỏng/không đọc được → coi như chưa có, tải mới bên dưới
      }
    }

    load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Đổi mốc thời gian (7/14/30 ngày) BẮT BUỘC phải gọi API mới vì số liệu khác hẳn,
  // không thể lấy từ cache của mốc cũ ra được.
  const handlePeriodChange = (d) => {
    setDays(d);
    load(d);
  };

  const statusCfg = STATUS_CONFIG[data?.status] || STATUS_CONFIG.INACTIVE;
  const m = data?.metrics;

  return (
    <div className="page">
      <Header />
      <div className="dashboard">
        <Sidebar />
        <main className="main-content lev-page">
          {/* Header */}
          <div className="lev-header">
            <div className="lev-header-left">
              <div className="lev-header-icon">
                <Brain size={22} />
              </div>
              <div>
                <h1 className="lev-title">Đánh giá học tập bằng AI</h1>
                <p className="lev-subtitle">
                  AI phân tích hoạt động thực tế của bạn trên hệ thống — quiz, flashcard, lộ trình học tập,
                  chuỗi điểm danh — để đưa ra nhận xét và gợi ý phù hợp.
                </p>
              </div>
            </div>
            <div className="lev-header-right">
              {fetchedAt && !loading && (
                <span className="lev-updated-at">
                  Cập nhật lúc {formatTimestamp(fetchedAt)}
                </span>
              )}
              <button
                className="lev-evaluate-btn"
                onClick={() => load(days)}
                disabled={loading}
                type="button"
              >
                {loading ? <RefreshCw size={15} className="lev-spin" /> : <Sparkles size={15} />}
                Đánh giá kết quả học tập của tôi
              </button>
            </div>
          </div>

          {/* Chọn khoảng thời gian */}
          <div className="lev-period-bar">
            <span className="lev-period-label">Khoảng thời gian đánh giá:</span>
            <div className="lev-period-pills">
              {PERIODS.map((p) => (
                <button
                  key={p.days}
                  className={`lev-period-pill${days === p.days ? " lev-period-pill--active" : ""}`}
                  onClick={() => handlePeriodChange(p.days)}
                  disabled={loading}
                  type="button"
                >
                  {p.label}
                </button>
              ))}
            </div>
            {data && (
              <span className="lev-period-range">
                {data.fromDate} → {data.toDate}
              </span>
            )}
          </div>

          {error && <div className="lev-error">{error}</div>}

          {/* Chỉ hiện skeleton toàn trang khi CHƯA từng có dữ liệu nào (lần đầu tiên) */}
          {loading && !data && (
            <div className="lev-loading">
              <div className="lev-skeleton lev-skeleton--hero" />
              <div className="lev-skeleton-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="lev-skeleton lev-skeleton--card" />
                ))}
              </div>
            </div>
          )}

          {!error && data && (
            <>
              {/* Hero: Score ring + AI summary */}
              <div className={`lev-hero${loading ? " lev-hero--loading" : ""}`} style={{ background: statusCfg.bg }}>
                {loading && (
                  <div className="lev-hero-overlay">
                    <RefreshCw size={18} className="lev-spin" />
                    <span>AI đang phân tích lại dữ liệu học tập của bạn... (thường mất 5–15 giây)</span>
                  </div>
                )}
                <ScoreRing score={data.activityScore} color={statusCfg.ring} />
                <div className="lev-hero-body">
                  <span className="lev-status-badge" style={{ color: statusCfg.color, background: "#fff" }}>
                    <TrendingUp size={12} />
                    {statusCfg.label}
                  </span>
                  <p className="lev-ai-summary">{data.aiSummary}</p>
                  <p className="lev-weekly-overview">{data.weeklyOverview}</p>
                </div>
              </div>

              {/* Metrics grid */}
              {m && (
                <div className="lev-metrics-grid">
                  <MetricCard
                    icon={Clock}
                    color="#3B82F6"
                    title="Mức độ hoạt động"
                    rows={[
                      { label: "Ngày có học", value: `${m.activeDays}/${days}` },
                      { label: "Ngày đăng nhập", value: `${m.loginDays}/${days}` },
                    ]}
                  />
                  <MetricCard
                    icon={ClipboardList}
                    color="#8B5CF6"
                    title="Quiz"
                    rows={[
                      { label: "Số lần làm", value: m.quizAttempts },
                      { label: "Điểm TB", value: `${m.averageQuizPercentage ?? 0}%` },
                      { label: "Điểm cao nhất", value: `${m.bestQuizPercentage ?? 0}%` },
                      { label: "Lần gần nhất", value: `${m.latestQuizPercentage ?? 0}%` },
                    ]}
                  />
                  <MetricCard
                    icon={Layers}
                    color="#F59E0B"
                    title="Flashcard"
                    rows={[
                      { label: "Số phiên ôn", value: m.flashcardStudySessions },
                      { label: "Số thẻ đã ôn", value: m.flashcardsReviewed },
                    ]}
                  />
                  <MetricCard
                    icon={Map}
                    color="#16A34A"
                    title="Lộ trình học tập"
                    rows={[
                      { label: "Roadmap đang học", value: m.activeRoadmaps },
                      { label: "Tiến độ TB", value: `${m.averageRoadmapProgress ?? 0}%` },
                    ]}
                  />
                  <MetricCard
                    icon={AlertTriangle}
                    color="#EF4444"
                    title="Kỷ luật"
                    rows={[
                      { label: "Task quá hạn", value: m.overdueTasks },
                      { label: "Milestone quá hạn", value: m.overdueMilestones },
                    ]}
                  />
                  <MetricCard
                    icon={Flame}
                    color="#EA580C"
                    title="Chuỗi học tập"
                    rows={[
                      { label: "Chuỗi hiện tại", value: `${m.currentStreak ?? 0} ngày` },
                      { label: "Kỷ lục", value: `${m.longestStreak ?? 0} ngày` },
                    ]}
                  />
                </div>
              )}

              {/* Strengths / Concerns / Recommendations */}
              <div className="lev-lists-grid">
                <ListCard
                  icon={CheckCircle2}
                  color="#16A34A"
                  title="Điểm mạnh"
                  items={data.strengths}
                  emptyText="Chưa đủ dữ liệu để ghi nhận điểm mạnh nổi bật trong kỳ này."
                />
                <ListCard
                  icon={AlertTriangle}
                  color="#D97706"
                  title="Cần chú ý"
                  items={data.concerns}
                  emptyText="Không có vấn đề đáng chú ý trong kỳ đánh giá này."
                />
                <ListCard
                  icon={Lightbulb}
                  color="#2563EB"
                  title="Đề xuất tiếp theo"
                  items={data.recommendations}
                  emptyText="Tiếp tục duy trì nhịp học hiện tại."
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}