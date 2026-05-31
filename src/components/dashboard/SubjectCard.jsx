export default function SubjectCard({ item }) {
  return (
    <div className="subject-card">
      <div className="subject-more">⋮</div>

      <div className="subject-icon">
        {item.icon}
      </div>

      <h4>{item.title}</h4>

      <div className="progress-wrapper">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${item.progress}%`,
            }}
          />
        </div>

        <div className="subject-footer">
          <span>{item.progress}%</span>

          <span>{item.docs} tài liệu</span>
        </div>
      </div>
    </div>
  );
}