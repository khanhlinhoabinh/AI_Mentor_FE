import { useState } from "react";
import styles from "./Detailstats.module.css";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from "recharts";

const DATA = [
  { subject:"Người dùng", A:80 },
  { subject:"Tài liệu",   A:90 },
  { subject:"Quiz",       A:65 },
  { subject:"Môn học",    A:70 },
  { subject:"Hoạt động",  A:85 },
];

export default function DetailStats() {
  const [period, setPeriod] = useState("Tháng này");
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Thống kê chi tiết</h3>
        <select className={styles.select} value={period} onChange={e=>setPeriod(e.target.value)}>
          {["Tháng này","Tuần này","Năm nay"].map(p=><option key={p}>{p}</option>)}
        </select>
      </div>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={DATA} margin={{top:10,right:20,bottom:10,left:20}}>
            <PolarGrid stroke="#E5E7EB"/>
            <PolarAngleAxis dataKey="subject" tick={{fontSize:11,fill:"#6B7280"}}/>
            <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
            <Radar name="Hệ thống" dataKey="A" stroke="#2F8F67" fill="#2F8F67" fillOpacity={0.2} strokeWidth={2}/>
            <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #E5E7EB"}}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}