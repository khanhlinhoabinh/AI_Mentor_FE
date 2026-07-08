import { Plus } from "lucide-react";
import MilestoneCard from "./MilestoneCard";
import styles from "./MilestoneList.module.css";

export default function MilestoneList({ milestones, isLoading, onAddMilestone }) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.list}>
        {isLoading && (
          <>
            <div className={`${styles.card} ${styles.skeleton}`} />
            <div className={`${styles.card} ${styles.skeleton}`} />
          </>
        )}

        {!isLoading && milestones.length === 0 && (
          <p className={styles.empty}>Chưa có milestone nào trong giai đoạn này.</p>
        )}

        {!isLoading &&
          milestones.map((milestone) => <MilestoneCard key={milestone.id} milestone={milestone} />)}
      </div>

      <button type="button" className={styles.floatingAddBtn} onClick={onAddMilestone}>
        <Plus size={18} />
        Thêm Milestone
      </button>
    </section>
  );
}