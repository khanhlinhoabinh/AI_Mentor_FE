import { useState } from "react";
import styles from "./Sidebar.module.css";
import {
  MdGridView, MdPeople, MdMenuBook, MdInsertDriveFile,
  MdLayers, MdMap, MdShowChart, MdNotifications, MdSecurity,
  MdFlag, MdBarChart, MdFormatListBulleted, MdStorage,
  MdChevronLeft, MdChevronRight,
} from "react-icons/md";

const NAV = [
  {
    section: null,
    items: [{ id: "overview", label: "Tổng quan", icon: MdGridView }],
  },
  {
    section: "QUẢN LÝ HỆ THỐNG",
    items: [
      { id: "users",     label: "Người dùng",       icon: MdPeople           },
      { id: "courses",   label: "Môn học",           icon: MdMenuBook         },
      { id: "docs",      label: "Tài liệu học tập",  icon: MdInsertDriveFile  },
      { id: "flashcard", label: "Flashcard & Quiz",  icon: MdLayers           },
      { id: "roadmap",   label: "Roadmap học tập",   icon: MdMap              },
      { id: "progress",  label: "Tiến độ học tập",   icon: MdShowChart        },
      { id: "reminder",  label: "Nhắc nhở",          icon: MdNotifications    },
    ],
  },
  {
    section: "KIỂM DUYỆT & BẢO MẬT",
    items: [
      { id: "violation", label: "Nội dung vi phạm",  icon: MdSecurity, badge: 3 },
      { id: "report",    label: "Báo cáo hệ thống",  icon: MdFlag             },
    ],
  },
  {
    section: "THỐNG KÊ & BÁO CÁO",
    items: [
      { id: "stats",  label: "Thống kê chi tiết",  icon: MdBarChart           },
      { id: "logs",   label: "Nhật ký hoạt động",  icon: MdFormatListBulleted },
      { id: "backup", label: "Sao lưu dữ liệu",    icon: MdStorage            },
    ],
  },
];

export default function Sidebar() {
  const [active, setActive]       = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

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
              return (
                <button
                  key={item.id}
                  className={`${styles.navItem} ${active === item.id ? styles.active : ""}`}
                  onClick={() => setActive(item.id)}
                  title={collapsed ? item.label : ""}
                >
                  <span className={styles.navIcon}><Icon size={18} /></span>
                  {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
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