import { Target } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import { clampPercent } from "../../../utils/roadmapUtils";
import styles from "./RoadmapOverview.module.css";

export default function RoadmapOverview({ roadmap, isLoading }) {
  if (isLoading || !roadmap) {
    return <div className={`${styles.card} ${styles.skeleton}`} />;
  }

  const progress = clampPercent(roadmap.progress);

  return (
    <section className={styles.card}>
      <div className={styles.iconBox}>
        <Target size={28} />
      </div>

      <div className={styles.info}>
        <span className={styles.label}>Mục tiêu</span>
        <h2 className={styles.title}>{roadmap.title}</h2>
        <p className={styles.goal}>{roadmap.goal}</p>

        <div className={styles.dates}>
          <span>Bắt đầu: {formatDate(roadmap.startDate)}</span>
          <span>Kết thúc dự kiến: {formatDate(roadmap.endDate)}</span>
        </div>
      </div>

      <div className={styles.progressBox}>
        <span className={styles.label}>Tiến độ tổng thể</span>
        <strong className={styles.progressValue}>{progress}%</strong>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.illustration} aria-hidden="true">🏔️</div>
    </section>
  );
}