import { Flame, Trophy, Star, Zap } from "lucide-react";
import { useStreak } from "../../../hooks/useStreak";
import "./StreakPanel.css";

const LEVEL_CONFIG = {
  BRONZE: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  SILVER: { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  GOLD: { color: "#f59e0b", bg: "#fefce8", border: "#fde047" },
  NONE: { color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0" },
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

  return (
    <div className="sp-card">
      {/* ── Header ── */}
      <div className="sp-header">
        <div className="sp-title-row">
          <Flame size={18} className="sp-flame-icon" />
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
          <span className="sp-badge-icon">{streak.badgeIcon}</span>
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
                <span className="sp-badge-item-icon">
                  {b.achieved ? b.icon : "🔒"}
                </span>
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
          return (
            <div className="sp-next-badge">
              <div className="sp-next-row">
                <span className="sp-next-label">
                  Tiếp theo: {next.icon} {next.title}
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
        <div className="sp-all-done">🏆 Bạn đã đạt tất cả danh hiệu!</div>
      )}
    </div>
  );
}
