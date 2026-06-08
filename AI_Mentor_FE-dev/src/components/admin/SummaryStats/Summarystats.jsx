import styles from "./Summarystats.module.css";
import { MdPeople, MdMenuBook, MdInsertDriveFile, MdTrendingUp, MdArrowUpward } from "react-icons/md";

const STATS = [
  { label:"Tổng người dùng", value:"2,584",  percent:"+18.6%", icon:MdPeople,          color:"#2F8F67", bg:"#E8F8F1" },
  { label:"Tổng môn học",    value:"1,243",  percent:"+11.3%", icon:MdMenuBook,         color:"#5B61FF", bg:"#EEEEFF" },
  { label:"Tổng tài liệu",  value:"3,782",  percent:"+9.7%",  icon:MdInsertDriveFile,  color:"#2F8F67", bg:"#E8F8F1" },
  { label:"Tổng lượt học",  value:"12,496", percent:"+24.5%", icon:MdTrendingUp,       color:"#F97316", bg:"#FFF0E6" },
];

export default function SummaryStats() {
  return (
    <div className={styles.row}>
      {STATS.map((s,i) => {
        const Icon = s.icon;
        return (
          <div key={i} className={styles.card}>
            <div className={styles.iconWrap} style={{background:s.bg,color:s.color}}>
              <Icon size={22}/>
            </div>
            <div className={styles.info}>
              <p className={styles.label}>{s.label}</p>
              <p className={styles.value}>{s.value}</p>
              <p className={styles.percent} style={{color:s.color}}>
                <MdArrowUpward size={11}/>{s.percent}
                <span className={styles.compared}>so với tuần trước</span>
              </p>
            </div>
            <div className={styles.sparkLine}>
              {[40,55,45,70,60,80,72].map((v,j)=>(
                <div key={j} className={styles.spark} style={{height:v*0.4+"px",background:s.color,opacity:0.3+j*0.1}}/>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}