import styles from "./Systemoverview.module.css";
import { MdMemory, MdStorage, MdAccessTime, MdFavorite, MdArrowUpward } from "react-icons/md";

const DATA = { cpu: 23, ram: 48, uptime: "15 ngày 8 giờ", database: "Ổn định", status: "Hoạt động tốt" };

function GaugeRing({ pct, color, size = 70 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={8} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}

export default function SystemOverview() {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Tổng quan hệ thống</h3>
      <div className={styles.grid}>
        {/* CPU */}
        <div className={styles.metricBox}>
          <div className={styles.metricTop}>
            <MdMemory size={15} className={styles.metricIcon} />
            <span className={styles.metricLabel}>CPU</span>
          </div>
          <div className={styles.gaugeWrap}>
            <GaugeRing pct={DATA.cpu} color="#2F8F67" />
            <span className={styles.gaugePct}>{DATA.cpu}%</span>
          </div>
          <div className={styles.miniLine}>
            {[20,38,28,52,34,60,44,54].map((v,i)=>(
              <div key={i} className={styles.miniBar} style={{ height: v/2+"px", background:"#2F8F67" }} />
            ))}
          </div>
        </div>

        {/* Center status ring */}
        <div className={styles.centerStatus}>
          <div className={styles.outerRing}>
            <div className={styles.middleRing}>
              <div className={styles.innerCircle}>
                <MdFavorite size={24} color="#2F8F67" />
                <p className={styles.statusLabel}>HỆ THỐNG</p>
                <p className={styles.statusOk}>{DATA.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RAM */}
        <div className={styles.metricBox}>
          <div className={styles.metricTop}>
            <MdStorage size={15} className={styles.metricIcon} />
            <span className={styles.metricLabel}>RAM</span>
          </div>
          <div className={styles.gaugeWrap}>
            <GaugeRing pct={DATA.ram} color="#5B61FF" />
            <span className={styles.gaugePct} style={{ color:"#5B61FF" }}>{DATA.ram}%</span>
          </div>
          <div className={styles.miniLine}>
            {[30,55,40,70,50,80,60,75].map((v,i)=>(
              <div key={i} className={styles.miniBar} style={{ height: v/2+"px", background:"#5B61FF" }} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerItem}>
          <MdAccessTime size={14} className={styles.footerIcon} />
          <div><p className={styles.footerLabel}>Uptime</p><p className={styles.footerValue}>{DATA.uptime}</p></div>
        </div>
        <div className={styles.footerItem}>
          <MdStorage size={14} className={styles.footerIcon} />
          <div><p className={styles.footerLabel}>Database</p><p className={styles.footerValue}>{DATA.database}</p></div>
        </div>
      </div>

      <div className={styles.miniStats}>
        <div className={styles.miniStat}>
          <span className={styles.miniStatValue}>2,584</span>
          <span className={styles.miniStatLabel}>Tổng người dùng</span>
          <span className={styles.miniStatPct}><MdArrowUpward size={10}/>18.6%</span>
        </div>
        <div className={styles.miniStatDivider}/>
        <div className={styles.miniStat}>
          <span className={styles.miniStatValue}>3,782</span>
          <span className={styles.miniStatLabel}>Tổng tài liệu</span>
          <span className={styles.miniStatPct} style={{color:"#5B61FF"}}><MdArrowUpward size={10}/>9.7%</span>
        </div>
      </div>
    </div>
  );
}