import styles from "./RightProgressPanel.module.css";

const DONUT_SIZE = 140;
const STROKE_WIDTH = 14;
const RADIUS = (DONUT_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RightProgressPanel({ stats }) {
  const percent = stats?.percent ?? 0;
  const dashOffset = CIRCUMFERENCE - (CIRCUMFERENCE * percent) / 100;

  return (
    <aside className={styles.panel}>
      <div className={styles.card}>
        <h3 className={styles.heading}>Tiến độ học tập</h3>

        <div className={styles.donutWrap}>
          <svg width={DONUT_SIZE} height={DONUT_SIZE}>
            <circle
              cx={DONUT_SIZE / 2}
              cy={DONUT_SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              className={styles.donutTrack}
              fill="none"
            />
            <circle
              cx={DONUT_SIZE / 2}
              cy={DONUT_SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              className={styles.donutValue}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
            />
          </svg>

          <span className={styles.percentLabel}>{percent}%</span>
        </div>

        <ul className={styles.legend}>
          <li>
            <span className={`${styles.dot} ${styles.dotCompleted}`} />
            Đã hoàn thành
            <strong>{stats?.completed ?? 0}</strong>
          </li>
          <li>
            <span className={`${styles.dot} ${styles.dotCurrent}`} />
            Đang thực hiện
            <strong>{stats?.current ?? 0}</strong>
          </li>
          <li>
            <span className={`${styles.dot} ${styles.dotUpcoming}`} />
            Chưa bắt đầu
            <strong>{stats?.upcoming ?? 0}</strong>
          </li>
        </ul>
      </div>
    </aside>
  );
}