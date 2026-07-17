import styles from "./Userdistribution.module.css";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const DEFAULT_COLORS = ["#2F8F67", "#F97316", "#A855F7", "#5B61FF", "#0EA5E9"];

/**
 * data: [{ name, value, color? }] — ví dụ phân bố role thật, tính từ
 * GET /api/admin/users (đếm theo role), hoặc phân bố Users/Documents/
 * QuizSets/FlashcardSets khi dùng ở trang Báo cáo thống kê.
 */
export default function UserDistribution({ data = [], title = "Phân bố người dùng", centerLabel = "Tổng người dùng" }) {
  const chartData = data.map((d, i) => ({ ...d, color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length] }));
  const total = chartData.reduce((s, d) => s + d.value, 0);

  const CenterLabel = ({ cx, cy }) => (
    <>
      <text x={cx} y={cy-10} textAnchor="middle" fill="#1F2937" fontSize="22" fontWeight="800">
        {total.toLocaleString()}
      </text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="#6B7280" fontSize="11">
        {centerLabel}
      </text>
    </>
  );

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.chartWrap}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={62} outerRadius={90}
                paddingAngle={3} dataKey="value" labelLine={false} label={CenterLabel}>
                {chartData.map((d,i)=><Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip formatter={(v,n)=>[v.toLocaleString(),n]}
                contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #E5E7EB"}}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 210, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 13 }}>
            Chưa có dữ liệu
          </div>
        )}
      </div>
      <div className={styles.legend}>
        {chartData.map((d,i)=>(
          <div key={i} className={styles.legendItem}>
            <span className={styles.dot} style={{background:d.color}}/>
            <span className={styles.legendName}>{d.name}</span>
            <span className={styles.legendVal}>{d.value.toLocaleString()}</span>
            <span className={styles.legendPct}>({total ? Math.round(d.value/total*100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
