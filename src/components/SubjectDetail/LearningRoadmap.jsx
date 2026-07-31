import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import "./LearningRoadmap.css";

// Khớp với STAGE_STATUS trong utils/roadmapUtils.js (completed / current / upcoming)
const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, iconColor: "#22c55e", lineColor: "#22c55e", noteColor: "#22c55e", label: "Hoàn thành" },
  current:   { icon: PlayCircle,   iconColor: "#22c55e", lineColor: "#e2e8f0", noteColor: "#3b82f6", label: "Đang thực hiện" },
  upcoming:  { icon: Lock,         iconColor: "#94a3b8", lineColor: "#e2e8f0", noteColor: "#94a3b8", label: "Chưa học" },
};

export default function LearningRoadmap({
  stages,
  roadmapId,
  loading,
  onViewDetail,
  onCreateRoadmap,
}) {
  return (
    <section className="lr-section">
      <div className="lr-header">
        <h2 className="lr-title">Lộ trình học tập</h2>
        <button
          className="lr-view-all"
          onClick={onViewDetail}
          disabled={!roadmapId}
        >
          Xem chi tiết lộ trình
        </button>
      </div>

      {loading ? (
        <div className="lr-empty">Đang tải lộ trình học tập...</div>
      ) : stages.length === 0 ? (
        <div className="lr-empty">
          <p>Môn học này chưa có lộ trình học tập nào được liên kết.</p>
          <button className="lr-create-btn" onClick={onCreateRoadmap}>
            Tạo lộ trình học tập
          </button>
        </div>
      ) : (
        <div className="lr-timeline">
          {stages.map((item, index) => {
            const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.upcoming;
            const Icon = cfg.icon;
            const isLast = index === stages.length - 1;

            return (
              <div className="lr-step" key={item.id}>
                <div className="lr-step-top">
                  <div className="lr-icon-wrap" style={{ color: cfg.iconColor }}>
                    <Icon size={30} strokeWidth={2} />
                  </div>
                  {!isLast && (
                    <div
                      className="lr-line"
                      style={{ background: cfg.lineColor }}
                    />
                  )}
                </div>
                <div className="lr-step-info">
                  <div className="lr-step-title">{item.title}</div>
                  <div className="lr-step-subtitle">{item.goal}</div>
                  <div className="lr-step-note" style={{ color: cfg.noteColor }}>
                    {item.status === "completed" && "✓ "}
                    {cfg.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}