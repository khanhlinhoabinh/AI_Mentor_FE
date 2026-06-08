export default function RightPanel() {
  return (
    <aside className="right-panel">
          {/* SCHEDULE */}
<div className="panel-card">
  <div className="panel-header">
    <h3>Lịch học hôm nay</h3>

    <button>Xem lịch</button>
  </div>

  <div className="schedule-list">
    <div className="schedule-card green">
      <div className="schedule-time">
        <span>09:00</span>
        <small>10:30</small>
      </div>

      <div className="schedule-info">
        <h4>Cấu trúc dữ liệu & Giải thuật</h4>
        <p>Học</p>
      </div>
    </div>

    <div className="schedule-card yellow">
      <div className="schedule-time">
        <span>14:00</span>
        <small>15:30</small>
      </div>

      <div className="schedule-info">
        <h4>Cơ sở dữ liệu</h4>
        <p>Ôn tập</p>
      </div>
    </div>

    <div className="schedule-card blue">
      <div className="schedule-time">
        <span>19:30</span>
        <small>20:30</small>
      </div>

      <div className="schedule-info">
        <h4>AI Machine Learning</h4>
        <p>Luyện tập</p>
      </div>
    </div>
  </div>
</div>

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