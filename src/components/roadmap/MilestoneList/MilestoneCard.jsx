import { MoreVertical, CalendarClock } from "lucide-react";
import { getMilestoneIcon } from "../../../utils/milestoneIcons";
import { formatDate, getDueDateStatus } from "../../../utils/dateUtils";
import styles from "./MilestoneCard.module.css";

export default function MilestoneCard({ milestone }) {
  const Icon = getMilestoneIcon(milestone.icon);
  const dueStatus = getDueDateStatus(milestone.dueDate);

  const dueDateClass = {
    overdue: styles.dueOverdue,
    soon: styles.dueSoon,
    normal: styles.dueNormal,
  }[dueStatus];

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