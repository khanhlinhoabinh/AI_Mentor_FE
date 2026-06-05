import { MoreVertical } from "lucide-react";
import "./SubjectCard.css";

export default function SubjectCard({
  subject,
  viewMode = "grid",
}) {
  const progressColor = "#94a3b8";

  if (viewMode === "list") {
    return (
      <div className="sc-list-row">

        <div
          className="sc-avatar"
          style={{ background: subject.color }}
        >
          {subject.initials}
        </div>

        <div className="sc-list-info">
          <div className="sc-name">
            {subject.name}
          </div>

          <div className="sc-category">
            {subject.description || "Chưa có mô tả"}
          </div>
        </div>

        <div
          className="sc-list-progress"
          style={{ color: progressColor }}
        >
          --
        </div>

        <div className="sc-list-date">
          Chưa có dữ liệu
        </div>

        <button className="sc-more-btn">
          <MoreVertical size={16} />
        </button>

      </div>
    );
  }

  return (
    <div className="sc-grid-card">

      <div className="sc-grid-header">

        <div
          className="sc-avatar"
          style={{ background: subject.color }}
        >
          {subject.initials}
        </div>

        <button className="sc-more-btn">
          <MoreVertical size={16} />
        </button>

      </div>

      <div className="sc-grid-body">

        <div className="sc-name">
          {subject.name}
        </div>

        <div className="sc-category">
          {subject.description || "Chưa có mô tả"}
        </div>

      </div>
      

      <div className="sc-grid-footer">

        <div
  className="sc-progress-value"
  style={{ color: progressColor }}
>
  --
</div>

        <div className="sc-date">
  Chưa cập nhật
</div>

      </div>

    </div>
  );
}