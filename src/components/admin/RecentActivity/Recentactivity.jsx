import styles from "./Recentactivity.module.css";
import { MdUpload, MdLock, MdQuiz, MdCheckCircle, MdBackup } from "react-icons/md";

const ACTIVITIES = [
  { icon: MdUpload,      color: "#2F8F67", bg: "#E8F8F1", text: "User123 đã upload tài liệu mới",     time: "10 phút trước" },
  { icon: MdLock,        color: "#EF4444", bg: "#FEE2E2", text: "Admin đã khóa tài khoản user456",    time: "25 phút trước" },
  { icon: MdQuiz,        color: "#5B61FF", bg: "#EEEEFF", text: "Quiz mới được tạo: Cơ sở dữ liệu",  time: "1 giờ trước"   },
  { icon: MdCheckCircle, color: "#2F8F67", bg: "#E8F8F1", text: "User789 đã hoàn thành bài quiz",     time: "2 giờ trước"   },
  { icon: MdBackup,      color: "#A855F7", bg: "#F3E8FF", text: "Backup dữ liệu hệ thống",            time: "3 giờ trước"   },
];

export default function RecentActivity() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Hoạt động gần đây</h3>
        <button className={styles.link}>Xem tất cả</button>
      </div>
      <div className={styles.list}>
        {ACTIVITIES.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className={`${styles.item} ${i < ACTIVITIES.length - 1 ? styles.itemBorder : ""}`}>
              <div className={styles.iconWrap} style={{ background: a.bg, color: a.color }}>
                <Icon size={15} />
              </div>
              <div className={styles.content}>
                <p className={styles.text}>{a.text}</p>
                <p className={styles.time}>{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}