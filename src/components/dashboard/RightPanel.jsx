import ReminderCalendar from "./ReminderCalendar/ReminderCalendar";
export default function RightPanel() {
  return (
    <aside className="right-panel">
      {/* REMINDER — thay thế card "Lịch học hôm nay" cũ */}
      <ReminderCalendar />

      {/* PROGRESS */}
      <div className="panel-card">
        <div className="panel-header">
          <h3>Tiến độ học tập</h3>
        </div>

        <div className="circle-progress">
          68%
        </div>

        <p className="progress-text">
          Bạn đã học 18/26 buổi
        </p>

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

      {/* ACHIEVEMENTS */}
      <div className="panel-card">
        <div className="panel-header">
          <h3>Thành tích</h3>

          <button>Xem tất cả</button>
        </div>

        <div className="achievement-item">
          <div className="achievement-icon">🔥</div>

          <div>
            <h4>Chuỗi ngày học tập</h4>
            <p>12 ngày liên tiếp</p>
          </div>
        </div>

        <div className="achievement-item">
          <div className="achievement-icon">🏆</div>

          <div>
            <h4>Thành tích đạt được</h4>
            <p>8/12 huy hiệu</p>
          </div>
        </div>

        <div className="achievement-item">
          <div className="achievement-icon">📚</div>

          <div>
            <h4>Tài liệu đã đọc</h4>
            <p>47 tài liệu tháng này</p>
          </div>
        </div>
      </div>
    </aside>
  );
}