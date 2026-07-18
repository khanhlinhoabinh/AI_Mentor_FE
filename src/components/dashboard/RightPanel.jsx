import ReminderCalendar from "./ReminderCalendar/ReminderCalendar";
import StreakPanel from "./StreakPanel/StreakPanel"; // ✅ thêm

export default function RightPanel() {
  return (
    <aside className="right-panel">
      {/* REMINDER */}
      <ReminderCalendar />

      {/* PROGRESS */}
      <div className="panel-card">
        <div className="panel-header">
          <h3>Tiến độ học tập</h3>
        </div>
        <div className="circle-progress">68%</div>
        <p className="progress-text">Bạn đã học 18/26 buổi</p>
        <div className="mini-chart">
          <div className="chart-bar h1"></div>
          <div className="chart-bar h2"></div>
          <div className="chart-bar h3"></div>
          <div className="chart-bar h4 active"></div>
          <div className="chart-bar h5"></div>
          <div className="chart-bar h6"></div>
          <div className="chart-bar h7"></div>
        </div>
      </div>

      {/* ✅ STREAK PANEL — thay thế ACHIEVEMENTS cũ */}
      <StreakPanel />
    </aside>
  );
}
