import TimelineNode from "./TimelineNode";
import styles from "./RoadmapTimeline.module.css";

const SCROLL_THRESHOLD = 6;

export default function RoadmapTimeline({ stages, activeStageId, onSelectStage, isLoading }) {
  if (isLoading) {
    return <div className={`${styles.wrapper} ${styles.skeleton}`} />;
  }

  if (!stages.length) return null;

  const shouldScroll = stages.length > SCROLL_THRESHOLD;

  return (
    <section className={styles.wrapper}>
      <div className={`${styles.track} ${shouldScroll ? styles.scrollable : ""}`}>
        {stages.map((stage, index) => (
          <TimelineNode
            key={stage.id}
            stage={stage}
            isActive={stage.id === activeStageId}
            isLast={index === stages.length - 1}
            onSelect={() => onSelectStage(stage.id)}
          />
        ))}
      </div>
    </section>
  );
}