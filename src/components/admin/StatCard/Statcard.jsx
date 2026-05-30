import styles from "./Statcard.module.css";
import { MdPeople, MdInsertDriveFile, MdQuiz, MdChat, MdArrowUpward } from "react-icons/md";

const ICONS = { users: MdPeople, docs: MdInsertDriveFile, quiz: MdQuiz, chat: MdChat };

export default function StatCard({ label, value, percent, icon, color, bg }) {
  const Icon = ICONS[icon] || MdPeople;
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap} style={{ background: bg, color }}>
        <Icon size={22} />
      </div>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      <p className={styles.percent} style={{ color: "#2F8F67" }}>
        <MdArrowUpward size={12} />{percent}
        <span className={styles.compared}>so với tuần trước</span>
      </p>
    </div>
  );
}