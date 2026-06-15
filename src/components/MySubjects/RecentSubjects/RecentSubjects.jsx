import "./RecentSubjects.css";

export default function RecentSubjects({ subjects }) {
  return (
    <div className="recent-subjects">
      <h2 className="recent-title">Môn học gần đây</h2>
      <div className="recent-list">
        {subjects.map((subject) => (
          <div className="recent-item" key={subject.id}>
            <div
              className="recent-avatar"
              style={{ background: subject.color }}
            >
              {subject.initials}
            </div>
            <div className="recent-info">
              <div className="recent-name">{subject.name}</div>
              <div className="recent-meta">
                {subject.category} · {subject.progress}% · Học {subject.lastStudied}
              </div>
              <div className="recent-progress-bar">
                <div
                  className="recent-progress-fill"
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </div>
            <button className="recent-continue-btn">Tiếp tục học</button>
          </div>
        ))}
      </div>
      <button className="view-all-link">Xem tất cả môn học gần đây →</button>
    </div>
  );
}