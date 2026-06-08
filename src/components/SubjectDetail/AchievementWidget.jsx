import "./AchievementWidget.css";

export default function AchievementWidget({ achievements }) {
  return (
    <div className="aw-widget">
      <h2 className="aw-title">Thành tích</h2>
      <div className="aw-grid">
        {achievements.map((item) => (
          <div className="aw-card" key={item.id}>
            <div className="aw-icon">{item.icon}</div>
            <div className="aw-value">{item.value}</div>
            <div className="aw-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}