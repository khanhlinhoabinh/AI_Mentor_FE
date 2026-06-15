import "./StudyProgress.css";

export default function StudyProgress({ data }) {
  const { total, completed, inProgress, notStarted } = data;

  // Donut chart using SVG
  const size = 120;
  const strokeWidth = 16;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;

  const completedDash = (completed.percent / 100) * circ;
  const inProgressDash = (inProgress.percent / 100) * circ;
  const notStartedDash = (notStarted.percent / 100) * circ;

  const completedOffset = 0;
  const inProgressOffset = -(completedDash);
  const notStartedOffset = -(completedDash + inProgressDash);

  return (
    <div className="study-progress">
      <h2 className="study-progress-title">Tiến độ học tập</h2>
      <div className="study-progress-body">
        <div className="donut-wrap">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* not started */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              strokeDasharray={`${notStartedDash} ${circ - notStartedDash}`}
              strokeDashoffset={notStartedOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            {/* in progress */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={strokeWidth}
              strokeDasharray={`${inProgressDash} ${circ - inProgressDash}`}
              strokeDashoffset={inProgressOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            {/* completed */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="#22c55e"
              strokeWidth={strokeWidth}
              strokeDasharray={`${completedDash} ${circ - completedDash}`}
              strokeDashoffset={completedOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
          <div className="donut-center">
            <div className="donut-total">{total}</div>
            <div className="donut-label">Tổng môn học</div>
          </div>
        </div>

        <div className="progress-legend">
          <div className="legend-item">
            <span className="legend-dot green"></span>
            <span className="legend-text">Hoàn thành</span>
            <span className="legend-pct">{completed.percent}%</span>
            <span className="legend-count">({completed.count} môn)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot blue"></span>
            <span className="legend-text">Đang học</span>
            <span className="legend-pct">{inProgress.percent}%</span>
            <span className="legend-count">({inProgress.count} môn)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot gray"></span>
            <span className="legend-text">Chưa học</span>
            <span className="legend-pct">{notStarted.percent}%</span>
            <span className="legend-count">({notStarted.count} môn)</span>
          </div>
        </div>
      </div>

      <button className="progress-detail-btn">Xem chi tiết thống kê →</button>
    </div>
  );
}