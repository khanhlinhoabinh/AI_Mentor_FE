import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  MdGridView,
  MdPeople,
  MdInsertDriveFile,
  MdBarChart,
  MdHistory,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

/**
 * Theo yêu cầu Product Owner: Admin chỉ còn 4 chức năng
 * (+ Dashboard tổng quan). Không còn menu nào khác.
 */
const NAV = [
  {
    section: null,
    items: [
      { id: "overview", label: "Dashboard", icon: MdGridView, path: "/admin/dashboard" },
      { id: "users", label: "Quản lý người dùng", icon: MdPeople, path: "/admin/users" },
      { id: "content", label: "Quản lý nội dung", icon: MdInsertDriveFile, path: "/admin/content" },
      { id: "reports", label: "Báo cáo thống kê", icon: MdBarChart, path: "/admin/reports" },
      { id: "history", label: "Lịch sử hệ thống", icon: MdHistory, path: "/admin/system-history" },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <path d="M14 3L3 9.5V20.5L14 27L25 20.5V9.5L14 3Z" fill="#2F8F67" opacity="0.25"/>
            <path d="M14 7L7 11V18L14 22L21 18V11L14 7Z"       fill="#2F8F67" opacity="0.55"/>
            <circle cx="14" cy="14" r="4" fill="#53B88B"/>
          </svg>
        </div>
        {!collapsed && (
          <div className={styles.logoText}>
            <span className={styles.logoName}>AI Mentor</span>
            <span className={styles.logoSub}>Admin Dashboard</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map((group, gi) => (
          <div key={gi} className={styles.navGroup}>
            {group.section && !collapsed && (
              <p className={styles.sectionLabel}>{group.section}</p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  className={`${styles.navItem} ${active ? styles.active : ""}`}
                  onClick={() => navigate(item.path)}
                  title={collapsed ? item.label : ""}
                >
                  <span className={styles.navIcon}><Icon size={18} /></span>
                  {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                  {!collapsed && <MdChevronRight size={14} className={styles.navArrow} />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse */}
      <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
        {collapsed
          ? <MdChevronRight size={18} />
          : <><MdChevronLeft size={16} /><span>Thu gọn</span></>}
      </button>
    </aside>
  );
}
