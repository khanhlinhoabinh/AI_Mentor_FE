import MilestoneCard from "./MilestoneCard";
import styles from "./MilestoneList.module.css";

export default function MilestoneList({ milestones, isLoading, onStatusChange }) {
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
          milestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} onStatusChange={onStatusChange} />
          ))}
      </div>
    </section>
  );
}