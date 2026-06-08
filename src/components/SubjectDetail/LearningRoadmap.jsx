import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import "./LearningRoadmap.css";

const STATUS_CONFIG = {
  completed:   { icon: CheckCircle2, iconColor: "#22c55e", lineColor: "#22c55e", noteColor: "#22c55e" },
  "in-progress": { icon: PlayCircle,   iconColor: "#22c55e", lineColor: "#e2e8f0", noteColor: "#3b82f6" },
  locked:      { icon: Lock,          iconColor: "#94a3b8", lineColor: "#e2e8f0", noteColor: "#94a3b8" },
};

export default function LearningRoadmap({ roadmap }) {
  return (
    <section className="lr-section">
      <div className="lr-header">
        <h2 className="lr-title">Lộ trình học tập</h2>
        <button className="lr-view-all">Xem chi tiết lộ trình</button>
      </div>

      <div className="lr-timeline">
        {roadmap.map((item, index) => {
          const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.locked;
          const Icon = cfg.icon;
          const isLast = index === roadmap.length - 1;

          return (
            <div className="lr-step" key={item.id}>
              <div className="lr-step-top">
                {/* Icon */}
                <div className="lr-icon-wrap" style={{ color: cfg.iconColor }}>
                  <Icon size={30} strokeWidth={2} />
                </div>
                {/* Connector line (not for last) */}
                {!isLast && (
                  <div
                    className="lr-line"
                    style={{ background: cfg.lineColor }}
                  />
                )}
              </div>
              <div className="lr-step-info">
                <div className="lr-step-title">{item.title}</div>
                <div className="lr-step-subtitle">{item.subtitle}</div>
                <div className="lr-step-note" style={{ color: cfg.noteColor }}>
                  {item.status === "completed" && "✓ "}
                  {item.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}