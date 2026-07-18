import styles from "./Recentactivity.module.css";
import { getActivityBadge, formatRelativeTime } from "../../../utils/activityBadges";

/**
 * activities: [{ activityId, fullName, action, description, createdAt }]
 * — lấy từ GET /api/admin/activity-logs (và cập nhật realtime qua SSE
 * ở nơi gọi component, ví dụ trang Lịch sử hệ thống / Dashboard).
 */
export default function RecentActivity({ activities = [], limit = 5 }) {
  const list = activities.slice(0, limit);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Hoạt động gần đây</h3>
        <button className={styles.link}>Xem tất cả</button>
      </div>
      <div className={styles.list}>
        {list.length === 0 && (
          <p className={styles.time}>Chưa có hoạt động nào</p>
        )}
        {list.map((a, i) => {
          const badge = getActivityBadge(a.action);
          const Icon = badge.icon;
          const text = a.description || `${a.fullName ?? "Người dùng"} — ${badge.label}`;
          return (
            <div key={a.activityId ?? i} className={`${styles.item} ${i < list.length - 1 ? styles.itemBorder : ""}`}>
              <div className={styles.iconWrap} style={{ background: badge.bg, color: badge.color }}>
                <Icon size={15} />
              </div>
              <div className={styles.content}>
                <p className={styles.text}>{text}</p>
                <p className={styles.time}>{formatRelativeTime(a.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
