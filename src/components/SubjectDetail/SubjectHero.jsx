import { Edit2, Users } from "lucide-react";
import "./SubjectHero.css";

export default function SubjectHero({ subject, onEdit }) {
  const {
    subjectName,
    description,
    updatedAt,
    initials,
    color,
    students,
    totalDocs,
    category,
  } = subject;

  return (
    <div className="sh-hero">
      {/* Left: avatar */}
      <div className="sh-avatar" style={{ background: color }}>
        {initials}
      </div>

      {/* Middle: info */}
      <div className="sh-info">
        <div className="sh-name-row">
          <h1 className="sh-name">{subjectName}</h1>
          <button className="sh-edit-btn" onClick={onEdit}>
            <Edit2 size={15} />
          </button>
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
              <div
                key={i}
                className="sh-student-av"
                style={{ zIndex: 3 - i, marginLeft: i === 0 ? 0 : -10 }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {students > 3 && (
              <div className="sh-student-av sh-student-more">+{students}</div>
            )}
          </div>
          <button className="sh-invite-btn">
            <Users size={13} /> Mời bạn học
          </button>
        </div>
      </div>
    </div>
  );
}