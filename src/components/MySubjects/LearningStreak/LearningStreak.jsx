import "./LearningStreak.css";

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Generate a mock 2-week grid
const week1 = [true, true, false, true, true, true, false];
const week2 = [false, true, true, true, false, true, true];

export default function LearningStreak({ data }) {
  const { currentStreak, record } = data;

  return (
    <div className="learning-streak">
      <h2 className="streak-title">Chuỗi ngày học tập</h2>

      <div className="streak-summary">
        <div className="streak-main">
          <span className="streak-fire">🔥</span>
          <div>
            <div className="streak-days">{currentStreak} ngày</div>
            <div className="streak-sub">Chuỗi hiện tại</div>
          </div>
        </div>
        <div className="streak-record">
          Kỷ lục: <strong>{record} ngày</strong>
        </div>
      </div>

      <div className="streak-grid">
        <div className="streak-header-row">
          {DAYS.map((d) => (
            <div className="streak-day-label" key={d}>{d}</div>
          ))}
        </div>
        <div className="streak-row">
          {week1.map((active, i) => (
            <div key={i} className={`streak-dot ${active ? "active" : ""}`} />
          ))}
        </div>
        <div className="streak-row">
          {week2.map((active, i) => (
            <div key={i} className={`streak-dot ${active ? "active" : ""}`} />
          ))}
        </div>
      </div>

      <button className="streak-detail-btn">Xem thống kê chi tiết →</button>
    </div>
  );
}