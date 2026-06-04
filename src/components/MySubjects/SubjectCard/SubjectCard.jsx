import { MoreVertical } from "lucide-react";
import "./SubjectCard.css";

export default function SubjectCard({ subject, viewMode = "grid" }) {
  const progressColor =
    subject.progress >= 70
      ? "#22c55e"
      : subject.progress >= 40
      ? "#3b82f6"
      : "#f97316";

  if (viewMode === "list") {
    /* ════ LIST ROW ════ */
    return (
      <div className="sc-list-row">
        {/* Avatar */}
        <div className="sc-avatar" style={{ background: subject.color }}>
          {subject.initials}
        </div>

        {/* Info */}
        <div className="sc-list-info">
          <div className="sc-name">{subject.name}</div>
          <div className="sc-category">{subject.category}</div>
        </div>

        {/* Progress */}
        <div className="sc-list-progress" style={{ color: progressColor }}>
          {subject.progress}%
        </div>

        {/* Date */}
        <div className="sc-list-date">Cập nhật: {subject.updatedAt}</div>

        {/* More */}
        <button className="sc-more-btn">
          <MoreVertical size={16} />
        </button>
      </div>
    );
  }

  /* ════ GRID CARD ════ */
  return (
    <div className="sc-grid-card">
      <div className="sc-grid-header">
        <div className="sc-avatar" style={{ background: subject.color }}>
          {subject.initials}
        </div>
        <button className="sc-more-btn">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="sc-grid-body">
        <div className="sc-name">{subject.name}</div>
        <div className="sc-category">{subject.category}</div>
      </div>

      <div className="sc-grid-footer">
        <div className="sc-progress-value" style={{ color: progressColor }}>
          {subject.progress}%
        </div>
        <div className="sc-date">Cập nhật: {subject.updatedAt}</div>
      </div>
    </div>
  );
}