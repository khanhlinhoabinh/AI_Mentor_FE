import { MoreVertical, CalendarClock } from "lucide-react";
import { getMilestoneIcon } from "../../../utils/milestoneIcons";
import { formatDate, getDueDateStatus } from "../../../utils/dateUtils";
import { MILESTONE_STATUS, MILESTONE_STATUS_LABEL } from "../../../utils/milestoneStatusUtils";
import styles from "./MilestoneCard.module.css";

export default function MilestoneCard({ milestone, onStatusChange }) {
  const Icon = getMilestoneIcon(milestone.icon);
  const dueStatus = getDueDateStatus(milestone.dueDate);

  const dueDateClass = {
    overdue: styles.dueOverdue,
    soon: styles.dueSoon,
    normal: styles.dueNormal,
  }[dueStatus];

  const statusClass = {
    [MILESTONE_STATUS.NOT_STARTED]: styles.statusNotStarted,
    [MILESTONE_STATUS.IN_PROGRESS]: styles.statusInProgress,
    [MILESTONE_STATUS.COMPLETED]: styles.statusCompleted,
  }[milestone.status];

  return (
    <article className={styles.card}>
      <div className={styles.iconBox}>
        <Icon size={20} />
      </div>

      <div className={styles.content}>
        <h4 className={styles.title}>{milestone.title}</h4>
        {milestone.description && (
          <p className={styles.description}>{milestone.description}</p>
        )}
      </div>

      <select
        className={`${styles.statusSelect} ${statusClass ?? ""}`}
        value={milestone.status}
        onChange={(e) => onStatusChange?.(milestone.id, e.target.value)}
      >
        {Object.entries(MILESTONE_STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <div className={`${styles.dueDate} ${dueDateClass}`}>
        <CalendarClock size={14} />
        <span>{formatDate(milestone.dueDate)}</span>
      </div>

      <button type="button" className={styles.menuBtn} aria-label="Tùy chọn milestone">
        <MoreVertical size={18} />
      </button>
    </article>
  );
}