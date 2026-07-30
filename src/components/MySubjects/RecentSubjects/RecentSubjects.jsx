import { useNavigate } from "react-router-dom";
import "./RecentSubjects.css";

const COLORS = [
  "#22c55e", "#3b82f6", "#8b5cf6", "#ef4444",
  "#f59e0b", "#06b6d4", "#ec4899", "#14b8a6",
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Chưa cập nhật";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function RecentSubjects({ subjects, loading }) {
  const navigate = useNavigate();

  return (
    <div className="recent-subjects">
      <h2 className="recent-title">Môn học gần đây</h2>

      <div className="recent-list">
        {loading && <p className="recent-empty">Đang tải...</p>}

        {!loading && subjects.length === 0 && (
          <p className="recent-empty">Chưa có môn học nào.</p>
        )}

        {!loading &&
          subjects.map((subject, index) => (
            <div className="recent-item" key={subject.subjectId}>
              <div
                className="recent-avatar"
                style={{ background: COLORS[index % COLORS.length] }}
              >
                {getInitials(subject.subjectName)}
              </div>

              <div className="recent-info">
                <div className="recent-name">{subject.subjectName}</div>
                <div className="recent-meta">
                  Cập nhật: {formatDate(subject.updatedAt)}
                </div>
              </div>

              <button
                className="recent-continue-btn"
                onClick={() => navigate(`/mysubjects/${subject.subjectId}`)}
              >
                Tiếp tục học
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}