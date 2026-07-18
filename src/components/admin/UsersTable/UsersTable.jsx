import styles from "./UsersTable.module.css";
import { MdVisibility, MdLock, MdLockOpen } from "react-icons/md";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const initialsOf = (name = "") =>
  name.split(" ").filter(Boolean).slice(-2).map((w) => w[0]).join("").toUpperCase();

/**
 * users: [{ userId, fullName, email, avatarUrl, role, isActive, createdAt, lastLogin }]
 * Dữ liệu thật từ GET /api/admin/users
 */
export default function UsersTable({ users = [], onView, onLock, onUnlock, actionLoadingId }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Email</th>
            <th>Role</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Last Login</th>
            <th style={{ textAlign: "right" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={7} className={styles.emptyCell}>Không có người dùng nào</td>
            </tr>
          )}
          {users.map((u) => (
            <tr key={u.userId}>
              <td>
                <div className={styles.userCell}>
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt={u.fullName} className={styles.avatarImg} />
                  ) : (
                    <div className={styles.avatarFallback}>{initialsOf(u.fullName)}</div>
                  )}
                  <span className={styles.fullName}>{u.fullName}</span>
                </div>
              </td>
              <td className={styles.muted}>{u.email}</td>
              <td>
                <span className={styles.roleBadge}>{u.role}</span>
              </td>
              <td>
                <span className={`${styles.statusBadge} ${u.isActive ? styles.statusActive : styles.statusLocked}`}>
                  {u.isActive ? "Hoạt động" : "Đã khoá"}
                </span>
              </td>
              <td className={styles.muted}>{formatDate(u.createdAt)}</td>
              <td className={styles.muted}>{formatDate(u.lastLogin)}</td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.iconBtn} title="Xem chi tiết" onClick={() => onView?.(u)}>
                    <MdVisibility size={17} />
                  </button>
                  {u.isActive ? (
                    <button
                      className={`${styles.iconBtn} ${styles.dangerBtn}`}
                      title="Khoá tài khoản"
                      disabled={actionLoadingId === u.userId}
                      onClick={() => onLock?.(u)}
                    >
                      <MdLock size={17} />
                    </button>
                  ) : (
                    <button
                      className={`${styles.iconBtn} ${styles.successBtn}`}
                      title="Mở khoá tài khoản"
                      disabled={actionLoadingId === u.userId}
                      onClick={() => onUnlock?.(u)}
                    >
                      <MdLockOpen size={17} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
