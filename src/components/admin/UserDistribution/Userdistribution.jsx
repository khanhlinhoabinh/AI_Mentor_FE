import styles from "./Userdistribution.module.css";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const DATA  = [
  { name:"User",      value:2120, color:"#2F8F67" },
  { name:"Admin",     value:320,  color:"#F97316" },
  { name:"Moderator", value:144,  color:"#A855F7" },
];
const TOTAL = DATA.reduce((s,d)=>s+d.value,0);

const CenterLabel = ({ cx, cy }) => (
  <>
    <text x={cx} y={cy-10} textAnchor="middle" fill="#1F2937" fontSize="22" fontWeight="800">
      {TOTAL.toLocaleString()}
    </text>
    <text x={cx} y={cy+12} textAnchor="middle" fill="#6B7280" fontSize="11">
      Tổng người dùng
    </text>
  </>
);

export default function UserDistribution() {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Phân bố người dùng</h3>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie data={DATA} cx="50%" cy="50%" innerRadius={62} outerRadius={90}
              paddingAngle={3} dataKey="value" labelLine={false} label={CenterLabel}>
              {DATA.map((d,i)=><Cell key={i} fill={d.color}/>)}
            </Pie>
            <Tooltip formatter={(v,n)=>[v.toLocaleString(),n]}
              contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #E5E7EB"}}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.legend}>
        {DATA.map((d,i)=>(
          <div key={i} className={styles.legendItem}>
            <span className={styles.dot} style={{background:d.color}}/>
            <span className={styles.legendName}>{d.name}</span>
            <span className={styles.legendVal}>{d.value.toLocaleString()}</span>
            <span className={styles.legendPct}>({Math.round(d.value/TOTAL*100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}