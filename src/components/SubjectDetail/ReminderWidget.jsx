import { Clock } from "lucide-react";
import "./ReminderWidget.css";

const MAX_REMINDERS = 2;

const STATUS_STYLE = {
  urgent: { bg: "#fef3c7", color: "#d97706", label: "Sắp đến hạn" },
  soon:   { bg: "#dbeafe", color: "#3b82f6", label: "Sắp diễn ra" },
  done:   { bg: "#dcfce7", color: "#22c55e", label: "Đã xong" },
};

export default function ReminderWidget({ reminders }) {
  const displayed = reminders.slice(0, MAX_REMINDERS);

  return (
    <div className="rw-widget">
      <div className="rw-header">
        <h2 className="rw-title">Nhắc nhở</h2>
        <button className="rw-view-all">Xem tất cả</button>
      </div>

      <div className="rw-list">
        {displayed.map((item) => {
          const style = STATUS_STYLE[item.status] || STATUS_STYLE.soon;
          return (
            <div className="rw-item" key={item.id}>
              <div className="rw-icon">
                <Clock size={15} />
              </div>
              <div className="rw-info">
                <div className="rw-item-title">{item.title}</div>
                <div className="rw-deadline">{item.deadline}</div>
              </div>
              <span className="rw-badge" style={{ background: style.bg, color: style.color }}>
                {style.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}