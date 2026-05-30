import styles from "./Topbar.module.css";
import { MdSearch, MdNotifications, MdSettings, MdKeyboardArrowDown } from "react-icons/md";

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.greeting}>Xin chào, Admin! 👋</h1>
      </div>

      <div className={styles.searchWrap}>
        <MdSearch size={20} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Tìm kiếm người dùng, môn học, tài liệu..."
        />
        <kbd className={styles.searchKbd}>Ctrl + K</kbd>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn}>
          <MdNotifications size={20} />
          <span className={styles.notifBadge}>8</span>
        </button>
        <button className={styles.iconBtn}>
          <MdSettings size={20} />
        </button>
        <div className={styles.userPill}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>AS</div>
            <span className={styles.avatarOnline} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Admin System</span>
            <span className={styles.userRole}>Super Admin</span>
          </div>
          <MdKeyboardArrowDown size={16} className={styles.userChev} />
        </div>
      </div>
    </header>
  );
}