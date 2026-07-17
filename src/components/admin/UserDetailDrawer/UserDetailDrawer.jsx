import styles from "./UserDetailDrawer.module.css";
import { MdClose, MdLock, MdLockOpen } from "react-icons/md";

const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("vi-VN");
};

const initialsOf = (name = "") =>
  name.split(" ").filter(Boolean).slice(-2).map((w) => w[0]).join("").toUpperCase();

/**
 * user: UserAdminResponse đầy đủ từ GET /api/admin/users/{id}
 * (avatar, fullname, email, role, active, createdAt, lastLogin,
 *  totalSubjects, totalDocuments, totalQuizSets, totalFlashcardSets)
 */
export default function UserDetailDrawer({ user, onClose, onLock, onUnlock, actionLoading }) {
  if (!user) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <MdClose size={20} />
        </button>

        <div className={styles.profile}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className={styles.avatarImg} />
          ) : (
            <div className={styles.avatarFallback}>{initialsOf(user.fullName)}</div>
          )}
          <h3 className={styles.name}>{user.fullName}</h3>
          <p className={styles.email}>{user.email}</p>
          <span className={styles.roleBadge}>{user.role}</span>
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Trạng thái</span>
            <span className={`${styles.statusBadge} ${user.isActive ? styles.statusActive : styles.statusLocked}`}>
              {user.isActive ? "Hoạt động" : "Đã khoá"}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Ngày tạo</span>
            <span className={styles.metaValue}>{formatDateTime(user.createdAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Last Login</span>
            <span className={styles.metaValue}>{formatDateTime(user.lastLogin)}</span>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{user.totalSubjects ?? 0}</p>
            <p className={styles.statLabel}>Môn học</p>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{user.totalDocuments ?? 0}</p>
            <p className={styles.statLabel}>Tài liệu</p>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{user.totalQuizSets ?? 0}</p>
            <p className={styles.statLabel}>Quiz Sets</p>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{user.totalFlashcardSets ?? 0}</p>
            <p className={styles.statLabel}>Flashcard Sets</p>
          </div>
        </div>

        <div className={styles.footer}>
          {user.isActive ? (
            <button className={styles.dangerAction} disabled={actionLoading} onClick={() => onLock?.(user)}>
              <MdLock size={16} /> Khoá tài khoản
            </button>
          ) : (
            <button className={styles.successAction} disabled={actionLoading} onClick={() => onUnlock?.(user)}>
              <MdLockOpen size={16} /> Mở khoá tài khoản
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
