import { useState } from "react";
import styles from "./Detailstats.module.css";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from "recharts";

/**
 * data: [{ subject, A }] với A đã được chuẩn hoá 0-100 (điểm % so với giá trị
 * lớn nhất trong nhóm) — tính từ dữ liệu thật (GET /api/admin/dashboard).
 * periodOptions / period / onPeriodChange: cho phép cha điều khiển filter.
 */
export default function DetailStats({
  data = [],
  periodOptions = ["Hôm nay", "3 ngày", "7 ngày"],
  period,
  onPeriodChange,
}) {
  const [internalPeriod, setInternalPeriod] = useState(period || periodOptions[periodOptions.length - 1]);
  const current = period ?? internalPeriod;

  const handleChange = (e) => {
    setInternalPeriod(e.target.value);
    onPeriodChange?.(e.target.value);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Thống kê chi tiết</h3>
        <select className={styles.select} value={current} onChange={handleChange}>
          {periodOptions.map(p=><option key={p}>{p}</option>)}
        </select>
      </div>
      <div className={styles.chartWrap}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={data} margin={{top:10,right:20,bottom:10,left:20}}>
              <PolarGrid stroke="#E5E7EB"/>
              <PolarAngleAxis dataKey="subject" tick={{fontSize:11,fill:"#6B7280"}}/>
              <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
              <Radar name="Hệ thống" dataKey="A" stroke="#2F8F67" fill="#2F8F67" fillOpacity={0.2} strokeWidth={2}/>
              <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #E5E7EB"}}/>
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 13 }}>
            Chưa có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
}
