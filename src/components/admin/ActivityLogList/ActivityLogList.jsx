import styles from "./ActivityLogList.module.css";
import { getActivityBadge, formatRelativeTime } from "../../../utils/activityBadges";

/**
 * logs: [{ activityId, fullName, action, description, createdAt }]
 * Danh sách đầy đủ hoạt động hệ thống — GET /activity-logs (load lần đầu)
 * + prepend realtime từ EventSource /activity-logs/stream.
 */
export default function ActivityLogList({ logs = [] }) {
  return (
    <div className={styles.list}>
      {logs.length === 0 && <p className={styles.empty}>Chưa có hoạt động nào được ghi nhận</p>}
      {logs.map((log, i) => {
        const badge = getActivityBadge(log.action);
        const Icon = badge.icon;
        const time = log.createdAt
          ? new Date(log.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
          : "";
        return (
          <div key={log.activityId ?? i} className={styles.item}>
            <div className={styles.timeCol}>
              <span className={styles.time}>{time}</span>
              <span className={styles.relative}>{formatRelativeTime(log.createdAt)}</span>
            </div>
            <div className={styles.iconWrap} style={{ background: badge.bg, color: badge.color }}>
              <Icon size={16} />
            </div>
            <div className={styles.content}>
              <p className={styles.text}>{log.description || `${log.fullName ?? "Người dùng"} — ${badge.label}`}</p>
              <span className={styles.badge} style={{ color: badge.color, background: badge.bg }}>{badge.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
