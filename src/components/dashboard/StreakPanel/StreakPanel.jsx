import { Flame, Award, Star, Crown, Lock, Trophy } from "lucide-react";
import { useStreak } from "../../../hooks/useStreak";
import "./StreakPanel.css";

const LEVEL_CONFIG = {
  BRONZE: { color: "#b45309", bg: "#fffbeb", border: "#fde68a", chip: "linear-gradient(135deg, #f59e0b, #b45309)" },
  SILVER: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", chip: "linear-gradient(135deg, #60a5fa, #2563eb)" },
  GOLD:   { color: "#a16207", bg: "#fefce8", border: "#fde047", chip: "linear-gradient(135deg, #facc15, #ca8a04)" },
  NONE:   { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", chip: "linear-gradient(135deg, #cbd5e1, #94a3b8)" },
};

// Icon vector cố định theo cấp bậc — thay cho emoji thô từ BE để tránh trông "hoạt hình"
const LEVEL_ICON = {
  BRONZE: Award,
  SILVER: Star,
  GOLD: Crown,
  NONE: Trophy,
};

export default function StreakPanel() {
  const { streak, loading } = useStreak();

  if (loading)
    return (
      <div className="sp-card sp-card--loading">
        <div className="sp-skeleton" />
      </div>
    );

  const current = streak?.currentStreak ?? 0;
  const longest = streak?.longestStreak ?? 0;
  const total = streak?.totalCheckIns ?? 0;
  const badges = streak?.badges ?? [];
  const done = streak?.checkedInToday ?? false;
  const lvlCfg = LEVEL_CONFIG[streak?.badgeLevel ?? "NONE"];
  const CurrentBadgeIcon = LEVEL_ICON[streak?.badgeLevel ?? "NONE"];

  return (
    <div className="sp-card">
      {/* ── Header ── */}
      <div className="sp-header">
        <div className="sp-title-row">
          <div className="sp-header-icon">
            <Flame size={16} strokeWidth={2.4} />
          </div>
          <h3 className="sp-title">Chuỗi học tập</h3>
        </div>
        {done && <span className="sp-done-badge">✓ Hôm nay</span>}
      </div>

      {/* ── Streak số lớn ── */}
      <div className="sp-main">
        <div
          className="sp-streak-circle"
          style={{ borderColor: lvlCfg.color, background: lvlCfg.bg }}
        >
          <span className="sp-streak-num" style={{ color: lvlCfg.color }}>
            {current}
          </span>
          <span className="sp-streak-unit">ngày</span>
        </div>

        <div className="sp-stats">
          <div className="sp-stat">
            <span className="sp-stat-val">{longest}</span>
            <span className="sp-stat-lbl">Kỷ lục</span>
          </div>
          <div className="sp-stat-divider" />
          <div className="sp-stat">
            <span className="sp-stat-val">{total}</span>
            <span className="sp-stat-lbl">Tổng ngày</span>
          </div>
        </div>
      </div>

      {/* ── Danh hiệu hiện tại ── */}
      {streak?.badgeTitle && (
        <div
          className="sp-current-badge"
          style={{
            background: lvlCfg.bg,
            border: `1.5px solid ${lvlCfg.border}`,
          }}
        >
          <div className="sp-badge-icon-chip" style={{ background: lvlCfg.chip }}>
            <CurrentBadgeIcon size={20} color="#fff" strokeWidth={2.2} />
          </div>
          <div>
            <div className="sp-badge-title" style={{ color: lvlCfg.color }}>
              {streak.badgeTitle}
            </div>
            <div className="sp-badge-sub">Danh hiệu hiện tại</div>
          </div>
        </div>
      )}

      {/* ── Tất cả danh hiệu ── */}
      <div className="sp-badges-section">
        <div className="sp-badges-label">Thành tích</div>
        <div className="sp-badges-list">
          {badges.map((b, i) => {
            const cfg = LEVEL_CONFIG[b.level] ?? LEVEL_CONFIG.NONE;
            const ItemIcon = b.achieved ? LEVEL_ICON[b.level] ?? Trophy : Lock;
            return (
              <div
                key={i}
                className={`sp-badge-item ${b.achieved ? "sp-badge-item--achieved" : "sp-badge-item--locked"}`}
                title={b.description}
                style={
                  b.achieved
                    ? {
                        background: cfg.bg,
                        border: `1.5px solid ${cfg.border}`,
                      }
                    : {}
                }
              >
                <div
                  className="sp-badge-item-chip"
                  style={{
                    background: b.achieved ? cfg.chip : "#e2e8f0",
                  }}
                >
                  <ItemIcon
                    size={16}
                    color={b.achieved ? "#fff" : "#94a3b8"}
                    strokeWidth={2.2}
                  />
                </div>
                <div className="sp-badge-item-info">
                  <span
                    className="sp-badge-item-name"
                    style={b.achieved ? { color: cfg.color } : {}}
                  >
                    {b.title}
                  </span>
                  <span className="sp-badge-item-desc">{b.description}</span>
                </div>
                {b.achieved && (
                  <span className="sp-badge-check" style={{ color: cfg.color }}>
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Progress bar đến danh hiệu tiếp theo ── */}
      {streak?.badgeLevel !== "GOLD" &&
        (() => {
          const next = badges.find((b) => !b.achieved);
          if (!next) return null;
          const pct = Math.min((current / next.requiredDays) * 100, 100);
          const NextIcon = LEVEL_ICON[next.level] ?? Trophy;
          return (
            <div className="sp-next-badge">
              <div className="sp-next-row">
                <span className="sp-next-label">
                  <NextIcon size={13} className="sp-next-icon" strokeWidth={2.4} />
                  Tiếp theo: {next.title}
                </span>
                <span className="sp-next-count">
                  {current}/{next.requiredDays} ngày
                </span>
              </div>
              <div className="sp-progress-track">
                <div
                  className="sp-progress-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })()}

      {/* Đã đạt tất cả */}
      {streak?.badgeLevel === "GOLD" && (
        <div className="sp-all-done">
          <Trophy size={16} strokeWidth={2.4} />
          Bạn đã đạt tất cả danh hiệu!
        </div>
      )}
    </div>
  );
}