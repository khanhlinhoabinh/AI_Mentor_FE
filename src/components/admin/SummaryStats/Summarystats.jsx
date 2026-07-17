import styles from "./Summarystats.module.css";
import { MdPeople, MdMenuBook, MdInsertDriveFile, MdTrendingUp, MdArrowUpward } from "react-icons/md";

const ICON_MAP = { users: MdPeople, subjects: MdMenuBook, docs: MdInsertDriveFile, activity: MdTrendingUp };

/**
 * stats: [{ key, label, value, percent?, color, bg, spark? }]
 * value === null | undefined  →  hiển thị "—" thay vì số giả, cho các chỉ số
 * mà backend hiện chưa có API (ví dụ tổng môn học / tổng lượt học).
 * Không tự chế số liệu — theo đúng yêu cầu "Không dùng dữ liệu mock".
 */
export default function SummaryStats({ stats = [] }) {
  return (
    <div className={styles.row}>
      {stats.map((s,i) => {
        const Icon = ICON_MAP[s.key] || MdTrendingUp;
        const hasValue = s.value !== null && s.value !== undefined;
        return (
          <div key={i} className={styles.card}>
            <div className={styles.iconWrap} style={{background:s.bg,color:s.color}}>
              <Icon size={22}/>
            </div>
            <div className={styles.info}>
              <p className={styles.label}>{s.label}</p>
              <p className={styles.value}>{hasValue ? s.value.toLocaleString() : "—"}</p>
              <p className={styles.percent} style={{color:s.color}}>
                {s.percent ? (
                  <>
                    <MdArrowUpward size={11}/>{s.percent}
                    <span className={styles.compared}>so với kỳ trước</span>
                  </>
                ) : (
                  <span className={styles.compared}>{hasValue ? "" : "Chưa có API"}</span>
                )}
              </p>
            </div>
            {hasValue && (
              <div className={styles.sparkLine}>
                {(s.spark || [40,55,45,70,60,80,72]).map((v,j)=>(
                  <div key={j} className={styles.spark} style={{height:v*0.4+"px",background:s.color,opacity:0.3+j*0.1}}/>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
