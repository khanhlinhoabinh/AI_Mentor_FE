import { Check } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import { STAGE_STATUS } from "../../../utils/roadmapUtils";
import styles from "./RoadmapTimeline.module.css";

export default function TimelineNode({ stage, isActive, isLast, onSelect }) {
  const isCompleted = stage.status === STAGE_STATUS.COMPLETED;

  const groupClass = [styles.nodeGroup, isCompleted && !isLast ? styles.lineCompleted : ""]
    .join(" ")
    .trim();

  const nodeClass = [
    styles.node,
    isCompleted ? styles.nodeCompleted : "",
    isActive ? styles.nodeActive : "",
  ]
    .join(" ")
    .trim();

  return (
    <div className={groupClass}>
      <button type="button" className={nodeClass} onClick={onSelect} aria-current={isActive ? "step" : undefined}>
        {isCompleted ? <Check size={14} /> : stage.order}
      </button>

      <div className={styles.nodeInfo}>
        {isActive && <span className={styles.currentBadge}>Hiện tại</span>}
        <span className={styles.nodeDate}>{formatDate(stage.startDate)}</span>
        <span className={styles.nodeTitle}>{stage.title}</span>
      </div>
    </div>
  );
}