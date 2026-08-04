import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Target, CheckCircle2, PlayCircle, Lock, ArrowRight, Plus } from "lucide-react";
import { getRoadmaps } from "../../services/roadmap.services";
import { getTasksByRoadmapId } from "../../services/roadmapTask.services";
import { mapTasksToStages } from "../../utils/taskMapper";
import { mapRoadmapToViewModel } from "../../utils/roadmapMapper";
import { getStageStats, clampPercent } from "../../utils/roadmapUtils";
import { formatDate } from "../../utils/dateUtils";
import "./SubjectRoadmapTab.css";

const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, color: "#22c55e", label: "Hoàn thành" },
  current: { icon: PlayCircle, color: "#3b82f6", label: "Đang thực hiện" },
  upcoming: { icon: Lock, color: "#94a3b8", label: "Chưa học" },
};

export default function SubjectRoadmapTab({ subjectId }) {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRoadmap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await getRoadmaps();
      const candidates = (all || []).filter(
        (r) => String(r.subjectId) === String(subjectId)
      );

      if (candidates.length === 0) {
        setRoadmap(null);
        setStages([]);
        return;
      }

      const target =
        candidates.find((r) => r.status === "IN_PROGRESS") ?? candidates[0];
      const tasks = await getTasksByRoadmapId(target.roadmapId);

      setRoadmap(mapRoadmapToViewModel(target));
      setStages(mapTasksToStages(tasks || []));
    } catch (err) {
      console.error("Không thể tải lộ trình học tập:", err);
      setError("Không thể tải lộ trình học tập.");
      setRoadmap(null);
      setStages([]);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    loadRoadmap();
  }, [loadRoadmap]);

  if (loading) {
    return (
      <div className="srt-wrap">
        <div className="srt-skeleton" style={{ minHeight: 140 }} />
        <div className="srt-skeleton" style={{ minHeight: 220 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="srt-wrap">
        <div className="srt-error">{error}</div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="srt-wrap">
        <div className="srt-empty">
          <div className="srt-empty-icon">🧭</div>
          <p className="srt-empty-title">
            Môn học này chưa có lộ trình học tập nào được liên kết
          </p>
          <p className="srt-empty-sub">
            Tạo lộ trình học tập để theo dõi tiến độ chinh phục môn học này
          </p>
          <button className="srt-create-btn" onClick={() => navigate("/roadmap")}>
            <Plus size={15} /> Tạo lộ trình học tập
          </button>
        </div>
      </div>
    );
  }

  const stats = getStageStats(stages);
  const progress = clampPercent(roadmap.progress ?? stats.percent);

  return (
    <div className="srt-wrap">
      {/* Overview */}
      <div className="srt-overview">
        <div className="srt-overview-icon">
          <Target size={26} />
        </div>

        <div className="srt-overview-info">
          <span className="srt-overview-label">Mục tiêu lộ trình</span>
          <h3 className="srt-overview-title">{roadmap.title}</h3>
          {roadmap.goal && <p className="srt-overview-goal">{roadmap.goal}</p>}
          <div className="srt-overview-dates">
            <span>Bắt đầu: {formatDate(roadmap.startDate)}</span>
            <span>Kết thúc dự kiến: {formatDate(roadmap.endDate)}</span>
          </div>
        </div>

        <div className="srt-overview-progress">
          <span className="srt-overview-label">Tiến độ tổng thể</span>
          <strong className="srt-progress-value">{progress}%</strong>
          <div className="srt-progress-bar">
            <div className="srt-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="srt-progress-stats">
            {stats.completed}/{stats.total} giai đoạn hoàn thành
          </span>
        </div>

        <button
          className="srt-detail-btn"
          onClick={() => navigate(`/roadmap/${roadmap.id}`)}
        >
          Xem chi tiết <ArrowRight size={14} />
        </button>
      </div>

      {/* Timeline */}
      <div className="srt-timeline-card">
        <h4 className="srt-timeline-title">Các giai đoạn học tập</h4>

        {stages.length === 0 ? (
          <div className="srt-timeline-empty">
            Lộ trình này chưa có giai đoạn nào.
          </div>
        ) : (
          <div className="srt-timeline">
            {stages.map((stage, index) => {
              const cfg = STATUS_CONFIG[stage.status] || STATUS_CONFIG.upcoming;
              const Icon = cfg.icon;
              const isLast = index === stages.length - 1;
              return (
                <div className="srt-step" key={stage.id}>
                  <div className="srt-step-line">
                    <div
                      className="srt-step-icon"
                      style={{ color: cfg.color, borderColor: cfg.color }}
                    >
                      <Icon size={18} />
                    </div>
                    {!isLast && (
                      <div
                        className="srt-step-connector"
                        style={{
                          background:
                            stage.status === "completed" ? "#22c55e" : "#e2e8f0",
                        }}
                      />
                    )}
                  </div>
                  <div className="srt-step-content">
                    <div className="srt-step-header">
                      <span className="srt-step-order">
                        Giai đoạn {stage.order}
                      </span>
                      <span className="srt-step-status" style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                    <h5 className="srt-step-title">{stage.title}</h5>
                    {stage.goal && <p className="srt-step-goal">{stage.goal}</p>}
                    <div className="srt-step-dates">
                      <span>
                        {formatDate(stage.startDate)} → {formatDate(stage.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}