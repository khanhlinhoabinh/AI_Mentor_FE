import { Edit2, Users } from "lucide-react";
import "./SubjectHero.css";

export default function SubjectHero({ subject }) {
  const { name, category, totalDocs, updatedAt, description, initials, color, students, progress } = subject;

  /* Donut SVG */
  const size = 110;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const completedDash   = (progress.completed / 100) * circ;
  const inProgressDash  = (progress.inProgress / 100) * circ;
  const notStartedDash  = (progress.notStarted / 100) * circ;

  return (
    <div className="sh-hero">
      {/* Left: avatar */}
      <div className="sh-avatar" style={{ background: color }}>
        {initials}
      </div>

      {/* Middle: info */}
      <div className="sh-info">
        <div className="sh-name-row">
          <h1 className="sh-name">{name}</h1>
          <button className="sh-edit-btn"><Edit2 size={15} /></button>
        </div>
        <div className="sh-meta">
          <span>{category}</span>
          <span className="sh-dot">•</span>
          <span>{totalDocs} tài liệu</span>
          <span className="sh-dot">•</span>
          <span>Cập nhật: {updatedAt}</span>
        </div>
        <p className="sh-desc">{description}</p>

        <div className="sh-students">
          <div className="sh-avatars">
            {[...Array(Math.min(students, 3))].map((_, i) => (
              <div key={i} className="sh-student-av" style={{ zIndex: 3 - i, marginLeft: i === 0 ? 0 : -10 }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {students > 3 && <div className="sh-student-av sh-student-more">+{students}</div>}
          </div>
          <button className="sh-invite-btn">
            <Users size={13} /> Mời bạn học
          </button>
        </div>
      </div>

      {/* Right: donut + legend */}
      <div className="sh-progress-block">
        <div className="sh-progress-label">Tiến độ tổng thể</div>
        <div className="sh-donut-row">
          <div className="sh-donut-wrap">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              {/* not started */}
              <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke}
                strokeDasharray={`${notStartedDash} ${circ - notStartedDash}`}
                strokeDashoffset={0}
                transform={`rotate(-90 ${size/2} ${size/2})`} />
              {/* in-progress */}
              <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#93c5fd" strokeWidth={stroke}
                strokeDasharray={`${inProgressDash} ${circ - inProgressDash}`}
                strokeDashoffset={-notStartedDash}
                transform={`rotate(-90 ${size/2} ${size/2})`} />
              {/* completed */}
              <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#22c55e" strokeWidth={stroke}
                strokeDasharray={`${completedDash} ${circ - completedDash}`}
                strokeDashoffset={-(notStartedDash + inProgressDash)}
                transform={`rotate(-90 ${size/2} ${size/2})`} />
            </svg>
            <div className="sh-donut-center">
              <div className="sh-donut-pct">{progress.overall}%</div>
            </div>
          </div>

          <div className="sh-legend">
            <div className="sh-legend-item">
              <span className="sh-legend-dot green"></span>
              <span className="sh-legend-text">Đã hoàn thành</span>
              <span className="sh-legend-val">{progress.completed}%</span>
            </div>
            <div className="sh-legend-item">
              <span className="sh-legend-dot blue"></span>
              <span className="sh-legend-text">Đang học</span>
              <span className="sh-legend-val">{progress.inProgress}%</span>
            </div>
            <div className="sh-legend-item">
              <span className="sh-legend-dot gray"></span>
              <span className="sh-legend-text">Chưa học</span>
              <span className="sh-legend-val">{progress.notStarted}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}