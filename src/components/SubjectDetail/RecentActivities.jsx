import { FileText, MessageCircle, StickyNote, ChevronRight } from "lucide-react";
import "./RecentActivities.css";

const MAX_ACTIVITIES = 3;

const ICON_MAP = {
  doc:  { Icon: FileText,      bg: "#dcfce7", color: "#22c55e" },
  chat: { Icon: MessageCircle, bg: "#dbeafe", color: "#3b82f6" },
  note: { Icon: StickyNote,    bg: "#fef9c3", color: "#ca8a04" },
};

export default function RecentActivities({ activities }) {
  const displayed = activities.slice(0, MAX_ACTIVITIES);

  return (
    <section className="ra-section">
      <h2 className="ra-title">Hoạt động gần đây</h2>
      <div className="ra-list">
        {displayed.map((item) => {
          const meta = ICON_MAP[item.type] || ICON_MAP.doc;
          const { Icon } = meta;
          return (
            <div className="ra-item" key={item.id}>
              <div className="ra-icon" style={{ background: meta.bg, color: meta.color }}>
                <Icon size={16} />
              </div>
              <div className="ra-info">
                <div className="ra-text">{item.text}</div>
                <div className="ra-time">{item.time}</div>
              </div>
              <ChevronRight size={16} className="ra-arrow" />
            </div>
          );
        })}
      </div>
    </section>
  );
}