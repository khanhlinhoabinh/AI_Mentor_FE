import styles from "../styles/admin/AdminDashboard.module.css";
import AdminLayout from "../components/layout/Adminlayout";
import StatCard from "../components/admin/StatCard/Statcard";
import SystemOverview from "../components/admin/SystemOverview/Systemoverview";
import ActivityChart from "../components/admin/ActivityChart/Activitychart";
import AlertPanel from "../components/admin/AlertPanel/Alertpanel";
import RecentActivity from "../components/admin/RecentActivity/Recentactivity";
import SummaryStats from "../components/admin/SummaryStats/Summarystats";
import PopularCourses from "../components/admin/PopularCourses/Popularcourses";
import DetailStats from "../components/admin/DetailStats/Detailstats";
import UserDistribution from "../components/admin/UserDistribution/Userdistribution";

function HeroSection() {
  return (
    <div className={styles.heroGrid}>
      <div className={styles.heroCard}>
        <div className={styles.heroGlow} />
        <div className={styles.heroIllustration}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
          <div className={styles.heroPlant}>
            <svg width="120" height="130" viewBox="0 0 120 130" fill="none">
              <ellipse cx="60" cy="118" rx="38" ry="9" fill="rgba(47,143,103,0.15)" />
              <rect x="56" y="60" width="8" height="58" rx="4" fill="#2F8F67" opacity="0.7" />
              <path d="M60 82 Q40 66 28 46 Q50 52 60 72" fill="#2F8F67" opacity="0.85" />
              <path d="M60 72 Q80 56 92 36 Q70 44 60 66" fill="#53B88B" opacity="0.85" />
              <path d="M60 92 Q33 81 20 60 Q44 66 60 84" fill="#2F8F67" opacity="0.65" />
              <circle cx="60" cy="38" r="20" fill="rgba(47,143,103,0.12)" stroke="#2F8F67" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="60" cy="38" r="11" fill="rgba(47,143,103,0.2)" />
              <circle cx="60" cy="38" r="5" fill="#2F8F67" />
              <circle cx="28" cy="98" r="7" fill="rgba(255,255,255,0.07)" stroke="rgba(83,184,139,0.4)" strokeWidth="1" />
              <circle cx="92" cy="88" r="5" fill="rgba(255,255,255,0.07)" stroke="rgba(83,184,139,0.3)" strokeWidth="1" />
              <circle cx="20" cy="60" r="4" fill="rgba(83,184,139,0.2)" />
              <circle cx="100" cy="55" r="3" fill="rgba(83,184,139,0.2)" />
            </svg>
          </div>
        </div>
      </div>
      {/* {statCards.map((s, i) => (
  <StatCard key={i} {...s} />
))} */}
    </div>
  );
}

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className={styles.pageOuter}>
        {/* Center content */}
        <div className={styles.centerCol}>
          <HeroSection />

          <div className={styles.middleRow}>
            <div className={styles.middleLeft}>
              <SystemOverview />
            </div>
            <div className={styles.middleRight}>
              { <ActivityChart /> }
            </div>
          </div>

          <SummaryStats />

          <div className={styles.bottomRow}>
            <div className={styles.bottomLeft}>
              <PopularCourses />
            </div>
            <div className={styles.bottomMid}>
              { <DetailStats /> }
            </div>
            <div className={styles.bottomRight}>
              { <UserDistribution /> }
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className={styles.rightCol}>
          <AlertPanel />
          <RecentActivity />
        </div>
      </div>
    </AdminLayout>
  );
}