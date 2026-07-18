import styles from "./EmptyState.module.css";

/**
 * Empty state dùng chung cho các trang admin chưa có backend API
 * (ví dụ: Quản lý nội dung). Thiết kế theo cùng ngôn ngữ hình ảnh với
 * Dashboard hiện tại (bo góc, nền trắng, tông xanh #2F8F67).
 */
export default function EmptyState({ icon, title, subtitle }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
