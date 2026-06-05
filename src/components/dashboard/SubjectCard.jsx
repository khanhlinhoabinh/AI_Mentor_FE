export default function SubjectCard({ item }) {
  return (
    <div className="subject-card">
      <div className="subject-more">⋮</div>

      <div className="subject-icon">
        📚
      </div>

      <h4>{item.subjectName}</h4>

      <div className="progress-wrapper">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: "0%",
            }}
          />
        </div>

        <div className="subject-footer">
          <span>Môn học</span>
          <span>ID: {item.subjectId}</span>
        </div>
      </div>
    </div>
  );
}