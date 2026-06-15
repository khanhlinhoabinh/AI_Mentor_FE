import styles from "./Alertpanel.module.css";
import { MdWarning, MdEmail, MdReport } from "react-icons/md";

const ALERTS = [
  { icon: MdReport,  color: "#EF4444", bg: "#FEE2E2", title: "3 tài liệu bị báo cáo",           sub: "Chờ kiểm duyệt", time: "10 phút trước" },
  { icon: MdEmail,   color: "#F97316", bg: "#FFF0E6", title: "5 người dùng chưa xác thực email", sub: "Cần xác minh",   time: "25 phút trước" },
  { icon: MdWarning, color: "#EAB308", bg: "#FEF9C3", title: "2 tài khoản đăng nhập bất thường", sub: "Cần kiểm tra",   time: "1 giờ trước"   },
];

export default function AlertPanel() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Cảnh báo hệ thống</h3>
        <button className={styles.link}>Xem tất cả</button>
      </div>
      <div className={styles.list}>
        {ALERTS.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className={`${styles.item} ${i < ALERTS.length - 1 ? styles.itemBorder : ""}`}>
              <div className={styles.iconWrap} style={{ background: a.bg, color: a.color }}>
                <Icon size={16} />
              </div>
              <div className={styles.content}>
                <p className={styles.itemTitle}>{a.title}</p>
                <p className={styles.itemSub}>{a.sub}</p>
              </div>
              <span className={styles.time}>{a.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}