import { MoreVertical } from "lucide-react";
import "./SubjectCard.css";
import { useState } from "react";

export default function SubjectCard({
  subject,
  viewMode = "grid",
  onViewDetail,
  onDelete,
}) {
  const [showMenu, setShowMenu] =
    useState(false);

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

        <div className="sc-menu-wrapper">

          <button
            className="sc-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="sc-dropdown">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onViewDetail(subject.id);
                }}
              >
                Xem chi tiết
              </button>

              <button
                className="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete(subject.id);
                }}
              >
                Xóa môn học
              </button>

            </div>
          )}

        </div>

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

        <div className="sc-menu-wrapper">

          <button
            className="sc-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="sc-dropdown">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onViewDetail(subject.id);
                }}
              >
                Xem chi tiết
              </button>

              <button
                className="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete(subject.id);
                }}
              >
                Xóa môn học
              </button>

            </div>
          )}

        </div>

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