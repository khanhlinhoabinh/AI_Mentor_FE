import styles from "./Popularcourses.module.css";

const COURSES = [
  { rank:1, name:"Cấu trúc dữ liệu và giải thuật", views:"1,248 lượt học", color:"#2F8F67" },
  { rank:2, name:"Trí tuệ nhân tạo",               views:"982 lượt học",  color:"#5B61FF" },
  { rank:3, name:"Cơ sở dữ liệu",                  views:"856 lượt học",  color:"#A855F7" },
  { rank:4, name:"Toán rời rạc",                   views:"754 lượt học",  color:"#F97316" },
  { rank:5, name:"Machine Learning",               views:"642 lượt học",  color:"#EAB308" },
];

export default function PopularCourses() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Top môn học phổ biến</h3>
        <button className={styles.link}>Xem tất cả</button>
      </div>
      <div className={styles.list}>
        {COURSES.map((c,i)=>(
          <div key={i} className={styles.item}>
            <div className={styles.rank} style={{background:c.color+"18",color:c.color}}>{c.rank}</div>
            <div className={styles.iconWrap} style={{background:c.color+"15"}}>📚</div>
            <div className={styles.info}>
              <p className={styles.name}>{c.name}</p>
              <p className={styles.views}>{c.views}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}