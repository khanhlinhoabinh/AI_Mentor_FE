import styles from "./Topbar.module.css";
import {
  MdSearch,
  MdNotifications,
  MdSettings,
  MdKeyboardArrowDown,
} from "react-icons/md";
import {
  LogOut,
  KeyRound,
  ShieldAlert,
  Bell,
  Check,
  CheckCheck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  countUnread,
  markAsRead,
  markAllAsRead,
} from "../../../services/notification.services";

/* ── Notification type config ── */
const NOTIF_CONFIG = {
  DOCUMENT_MODERATION: {
    icon: "⚠️",
    color: "#f97316",
    bg: "#fff7ed",
    label: "Vi phạm tài liệu",
  },
  REMINDER: { icon: "🔔", color: "#3b82f6", bg: "#eff6ff", label: "Nhắc nhở" },
  ROADMAP: { icon: "🗺️", color: "#8b5cf6", bg: "#f5f3ff", label: "Lộ trình" },
  AI_MESSAGE: {
    icon: "🤖",
    color: "#10b981",
    bg: "#ecfdf5",
    label: "AI Mentor",
  },
};

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now - d;
  const diffM = Math.floor(diffMs / 60000);
  if (diffM < 1) return "Vừa xong";
  if (diffM < 60) return `${diffM} phút trước`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `${diffH} giờ trước`;
  return d.toLocaleDateString("vi-VN");
}

/* ── Notification Dropdown ── */
function NotifDropdown({ onClose }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getNotifications();
        setNotifs(data);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMarkOne = async (id) => {
    try {
      await markAsRead(id);
      setNotifs((prev) =>
        prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n)),
      );
    } catch {}
  };

  const handleMarkAll = async () => {
    setMarking(true);
    try {
      await markAllAsRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
    } finally {
      setMarking(false);
    }
  };

  const unread = notifs.filter((n) => !n.isRead).length;

  return (
    <div className={styles.notifDropdown}>
      {/* Header */}
      <div className={styles.notifHeader}>
        <div className={styles.notifHeaderLeft}>
          <span className={styles.notifTitle}>Thông báo</span>
          {unread > 0 && (
            <span className={styles.notifUnreadBadge}>{unread}</span>
          )}
        </div>
        {unread > 0 && (
          <button
            className={styles.markAllBtn}
            onClick={handleMarkAll}
            disabled={marking}
          >
            <CheckCheck size={13} />
            Đọc tất cả
          </button>
        )}
      </div>

      {/* List */}
      <div className={styles.notifList}>
        {loading ? (
          <div className={styles.notifState}>Đang tải...</div>
        ) : notifs.length === 0 ? (
          <div className={styles.notifState}>
            <Bell size={28} color="#E5E7EB" />
            <p>Không có thông báo</p>
          </div>
        ) : (
          notifs.map((n) => {
            const cfg = NOTIF_CONFIG[n.type] ?? NOTIF_CONFIG.REMINDER;
            const isViolation = n.type === "DOCUMENT_MODERATION";
            return (
              <div
                key={n.notificationId}
                className={`${styles.notifItem} ${!n.isRead ? styles.notifItemUnread : ""} ${isViolation ? styles.notifItemViolation : ""}`}
                onClick={() => !n.isRead && handleMarkOne(n.notificationId)}
              >
                {/* Icon */}
                <div
                  className={styles.notifIcon}
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.icon}
                </div>

                {/* Content */}
                <div className={styles.notifContent}>
                  <div className={styles.notifItemTitle}>{n.title}</div>
                  <div className={styles.notifItemBody}>
                    {n.content?.slice(0, 80)}
                    {n.content?.length > 80 ? "..." : ""}
                  </div>
                  <div className={styles.notifMeta}>
                    <span
                      className={styles.notifTypeBadge}
                      style={{ color: cfg.color, background: cfg.bg }}
                    >
                      {cfg.label}
                    </span>
                    <span className={styles.notifTime}>
                      {formatTime(n.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Unread dot / read check */}
                <div className={styles.notifStatus}>
                  {!n.isRead ? (
                    <span className={styles.unreadDot} />
                  ) : (
                    <Check size={12} color="#9CA3AF" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {notifs.length > 0 && (
        <div className={styles.notifFooter}>
          {unread === 0 ? "Tất cả đã đọc ✓" : `${unread} chưa đọc`}
        </div>
      )}
    </div>
  );
}

/* ══ Topbar ══ */
export default function Topbar() {
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCnt, setUnreadCnt] = useState(0);

  const navigate = useNavigate();
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const initials =
    user?.fullName
      ?.split(" ")
      .map((x) => x[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD";

  /* Đếm unread khi mount và sau mỗi 30 giây */
  useEffect(() => {
    const load = async () => {
      try {
        setUnreadCnt(await countUnread());
      } catch {}
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  /* Click ra ngoài đóng dropdown */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.greeting}>Dashboard</h1>
      </div>

      <div className={styles.searchWrap}>
        <MdSearch size={20} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Tìm kiếm người dùng..."
        />
        <kbd className={styles.searchKbd}>Ctrl + K</kbd>
      </div>

      <div className={styles.actions}>
        {/* ✅ Notification bell thật */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            className={styles.iconBtn}
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
          >
            <MdNotifications size={20} />
            {unreadCnt > 0 && (
              <span className={styles.notifBadge}>
                {unreadCnt > 99 ? "99+" : unreadCnt}
              </span>
            )}
          </button>

          {notifOpen && <NotifDropdown onClose={() => setNotifOpen(false)} />}
        </div>

        <button className={styles.iconBtn}>
          <MdSettings size={20} />
        </button>

        {/* User dropdown */}
        <div ref={userRef} className={styles.userDropdown}>
          <div
            className={styles.userPill}
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
          >
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>{initials}</div>
              <span className={styles.avatarOnline} />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.fullName}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
            <MdKeyboardArrowDown size={16} className={styles.userChev} />
          </div>

          {userOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownUser}>
                <strong>{user?.fullName}</strong>
                <p>{user?.email}</p>
              </div>
              <button onClick={() => navigate("/admin/change-password")}>
                <KeyRound size={16} /> Đổi mật khẩu
              </button>
              <button onClick={handleLogout}>
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
