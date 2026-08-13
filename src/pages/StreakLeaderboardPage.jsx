import { useState, useEffect, useCallback } from "react";
import { Flame, Trophy, Medal, Award, Crown } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { getLeaderboard } from "../services/streak.services";
import "../styles/StreakLeaderboardPage.css";

const getInitials = (name) =>
  (name || "")
    .split(" ")
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const PODIUM_CONFIG = {
  1: { icon: Crown, color: "#F59E0B", bg: "linear-gradient(135deg,#FDE68A,#FBBF24)", label: "Hạng Nhất" },
  2: { icon: Medal, color: "#94A3B8", bg: "linear-gradient(135deg,#E2E8F0,#CBD5E1)", label: "Hạng Nhì" },
  3: { icon: Award, color: "#C2703D", bg: "linear-gradient(135deg,#FBD8B5,#F0B080)", label: "Hạng Ba" },
};

function Avatar({ name, avatarUrl, size = 44 }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="lb-avatar-img"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div className="lb-avatar-fallback" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {getInitials(name)}
    </div>
  );
}

function PodiumCard({ entry, place }) {
  if (!entry) return <div className="lb-podium-card lb-podium-card--empty" />;
  const cfg = PODIUM_CONFIG[place];
  const Icon = cfg.icon;

  return (
    <div className={`lb-podium-card lb-podium-card--${place}`}>
      <div className="lb-podium-rank-icon" style={{ background: cfg.bg }}>
        <Icon size={place === 1 ? 26 : 20} color={cfg.color} />
      </div>
      <Avatar name={entry.fullName} avatarUrl={entry.avatarUrl} size={place === 1 ? 68 : 56} />
      {entry.isCurrentUser && <span className="lb-you-badge">Bạn</span>}
      <span className="lb-podium-name">{entry.fullName}</span>
      <div className="lb-podium-streak">
        <Flame size={14} />
        {entry.longestStreak}
      </div>
      <span className="lb-podium-label" style={{ color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

export default function StreakLeaderboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeaderboard();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải bảng xếp hạng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const top3 = data?.topUsers?.slice(0, 3) || [];
  const rest = data?.topUsers?.slice(3) || [];
  const myEntryInTop = data?.topUsers?.find((e) => e.isCurrentUser);
  const showMyRankCard = data?.myRank && !myEntryInTop;

  return (
    <div className="page">
      <Header />
      <div className="dashboard">
        <Sidebar />
        <main className="main-content lb-page">
          <div className="lb-header">
            <div className="lb-header-icon">
              <Trophy size={22} />
            </div>
            <div>
              <h1 className="lb-title">Bảng xếp hạng chuỗi học tập</h1>
              <p className="lb-subtitle">
                Top {data?.topUsers?.length ? Math.min(50, data.topUsers.length) : 50} người có chuỗi học tập dài
                nhất — cùng kỷ lục, ai đạt mốc <strong>trước</strong> sẽ được xếp hạng cao hơn.
              </p>
            </div>
          </div>

          {loading && (
            <div className="lb-loading">
              <div className="lb-skeleton-podium">
                <div className="lb-skeleton lb-skeleton--sm" />
                <div className="lb-skeleton lb-skeleton--lg" />
                <div className="lb-skeleton lb-skeleton--sm" />
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="lb-skeleton lb-skeleton--row" />
              ))}
            </div>
          )}

          {error && !loading && <div className="lb-error">{error}</div>}

          {!loading && !error && data && (
            <>
              {/* Vị trí của bạn (nếu ngoài top 50 hoặc chưa từng điểm danh) */}
              {showMyRankCard && (
                <div className="lb-my-rank-card">
                  <span className="lb-my-rank-number">#{data.myRank}</span>
                  <div className="lb-my-rank-info">
                    <span className="lb-my-rank-label">Vị trí hiện tại của bạn</span>
                    <span className="lb-my-rank-sub">
                      Kỷ lục {data.myLongestStreak} ngày — trên tổng số {data.totalRankedUsers} người đã tham gia
                    </span>
                  </div>
                  <Flame size={22} className="lb-my-rank-flame" />
                </div>
              )}

              {!data.myRank && (
                <div className="lb-my-rank-card lb-my-rank-card--empty">
                  <Flame size={20} />
                  <span>
                    Bạn chưa có kỷ lục nào — hãy điểm danh mỗi ngày ở Trang chủ để bắt đầu leo hạng!
                  </span>
                </div>
              )}

              {/* Top 3 podium */}
              {top3.length > 0 ? (
                <div className="lb-podium">
                  <PodiumCard entry={top3[1]} place={2} />
                  <PodiumCard entry={top3[0]} place={1} />
                  <PodiumCard entry={top3[2]} place={3} />
                </div>
              ) : (
                <div className="lb-empty">
                  <Trophy size={40} />
                  <p>Chưa có ai lập kỷ lục chuỗi học tập. Hãy là người đầu tiên!</p>
                </div>
              )}

              {/* Danh sách hạng 4 trở đi */}
              {rest.length > 0 && (
                <div className="lb-list">
                  {rest.map((entry) => (
                    <div
                      key={entry.userId}
                      className={`lb-row${entry.isCurrentUser ? " lb-row--you" : ""}`}
                    >
                      <span className="lb-row-rank">{entry.rank}</span>
                      <Avatar name={entry.fullName} avatarUrl={entry.avatarUrl} size={40} />
                      <div className="lb-row-info">
                        <span className="lb-row-name">
                          {entry.fullName}
                          {entry.isCurrentUser && <span className="lb-you-badge lb-you-badge--inline">Bạn</span>}
                        </span>
                        <span className="lb-row-date">Đạt kỷ lục ngày {formatDate(entry.achievedAt)}</span>
                      </div>
                      <div className="lb-row-streak">
                        <Flame size={15} />
                        <span>{entry.longestStreak}</span>
                        <span className="lb-row-streak-unit">ngày</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}