
import AdminHeroSection from "./AdminHeroSection";
import AdminAlertPanel from "./AdminAlertPanel";
import AdminRecentActivity from "./AdminRecentActivity";

import "./AdminDashboardBody.css";

const AdminDashboardBody = () => {
  return (
    <div className="admin-dashboard-grid">

      <div className="admin-dashboard-left">

        <AdminHeroSection />

      </div>

      <div className="admin-dashboard-right">

        <AdminAlertPanel />

        <AdminRecentActivity />

      </div>

    </div>
  );
};

export default AdminDashboardBody;