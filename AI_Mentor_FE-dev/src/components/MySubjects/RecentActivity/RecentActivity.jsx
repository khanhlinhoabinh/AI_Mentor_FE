import { BookOpen, Upload, MessageCircle } from "lucide-react";
import "./RecentActivity.css";

const MAX_ACTIVITIES = 3;

const iconMap = {
  study:  <BookOpen size={15} />,
  upload: <Upload size={15} />,
  chat:   <MessageCircle size={15} />,
};

const colorMap = {
  study:  "green",
  upload: "blue",
  chat:   "purple",
};

export default function RecentActivity({ activities }) {
  // Luôn lấy tối đa MAX_ACTIVITIES — production-ready: hoạt động với bất kỳ độ dài data
  const displayed = activities.slice(0, MAX_ACTIVITIES);

  return (
    <div className="recent-activity">
      <h2 className="activity-title">Hoạt động gần đây</h2>

      {/* Danh sách — flex: 1, trải đều 3 item, không scroll */}
      <div className="activity-list">
        {displayed.map((item) => (
          <div className="activity-item" key={item.id}>
            <div className={`activity-icon ${colorMap[item.type] || "green"}`}>
              {iconMap[item.type]}
            </div>
            <div className="activity-info">
              <div className="activity-text">{item.text}</div>
              <div className="activity-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer luôn ghim xuống đáy card */}
      <div className="activity-footer">
        <button className="activity-all-btn">Xem tất cả hoạt động →</button>
      </div>
    </div>
  );
}