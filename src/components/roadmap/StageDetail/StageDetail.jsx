import { Plus } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import styles from "./StageDetail.module.css";

export default function StageDetail({ stage, milestoneCount, onAddMilestone }) {
  if (!stage) return null;

  return (
    <section className={styles.card}>
      <div className={styles.info}>
        <span className={styles.eyebrow}>Giai đoạn {stage.order}</span>
        <h3 className={styles.title}>{stage.title}</h3>

        <div className={styles.meta}>
          <span>Bắt đầu: {formatDate(stage.startDate)}</span>
          <span>Kết thúc: {formatDate(stage.endDate)}</span>
          <span>{milestoneCount} milestone</span>
        </div>
      </div>

      <button type="button" className={styles.addBtn} onClick={onAddMilestone}>
        <Plus size={16} />
        Thêm milestone
      </button>
    </section>
  );
}