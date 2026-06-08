import styles from "./Adminlayout.module.css";
import Sidebar from "../admin/Sidebar/Sidebar";
import Topbar from "../admin/Topbar/Topbar";

export default function AdminLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}