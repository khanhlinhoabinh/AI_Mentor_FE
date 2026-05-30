import AdminSidebar from "../components/admin/layout/AdminSidebar";
import AdminHeader from "../components/admin/layout/AdminHeader";

import AdminDashboardBody from "../components/admin/dashboard/AdminDashboardBody";

import "../styles/admin/AdminDashboard.css";

const AdminDashboardPage = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <div className="admin-content">
          <AdminDashboardBody />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;