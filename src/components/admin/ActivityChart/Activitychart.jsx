import { useState } from "react";
import styles from "./Activitychart.module.css";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const DATA = [
  { day:"T2", users:350,  docs:800  },
  { day:"T3", users:520,  docs:950  },
  { day:"T4", users:280,  docs:650  },
  { day:"T5", users:540,  docs:1150 },
  { day:"T6", users:400,  docs:950  },
  { day:"T7", users:760,  docs:1220 },
  { day:"CN", users:920,  docs:1280 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color: p.color, fontSize: 12 }}>
          {p.dataKey === "users" ? "Người dùng" : "Tài liệu"}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function ActivityChart() {
  const [range, setRange] = useState("7 ngày qua");
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Hoạt động hệ thống</h3>
        <select className={styles.rangeSelect} value={range} onChange={e => setRange(e.target.value)}>
          {["7 ngày qua","30 ngày","3 tháng"].map(r => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.dot} style={{background:"#2F8F67"}}/>Người dùng</span>
        <span className={styles.legendItem}><span className={styles.dot} style={{background:"#5B61FF"}}/>Tài liệu</span>
      </div>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={DATA} margin={{top:5,right:5,left:-15,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
            <XAxis dataKey="day" tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Line type="monotone" dataKey="users" stroke="#2F8F67" strokeWidth={2.5} dot={{r:4,fill:"#2F8F67",strokeWidth:0}} activeDot={{r:6}}/>
            <Line type="monotone" dataKey="docs"  stroke="#5B61FF" strokeWidth={2.5} dot={{r:4,fill:"#5B61FF",strokeWidth:0}} activeDot={{r:6}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}