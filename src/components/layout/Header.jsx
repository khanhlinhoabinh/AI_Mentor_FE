import { Search, Calendar, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell/NotificationBell";
import CheckInButton from "./CheckInButton/CheckInButton";
import { useStreak } from "../../hooks/useStreak";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { streak, checking, handleCheckIn } = useStreak();
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const isRemindersActive = location.pathname.startsWith("/reminders");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="top-header">
      <div className="logo">
        <div className="logo-icon">🌿</div>
        <div>
          <h1>AI Mentor</h1>
        </div>
      </div>

      <div className="search-box">
        <Search size={18} />
        <input type="text" placeholder="Tìm kiếm môn học, tài liệu..." />
      </div>

      <div className="top-actions">
        {user && (
          <CheckInButton
            streak={streak}
            checking={checking}
            onCheckIn={handleCheckIn}
          />
        )}

        <NotificationBell />

        <div
          className={`top-icon${isRemindersActive ? " top-icon--active" : ""}`}
          onClick={() => navigate("/reminders")}
          title="Lịch nhắc nhở"
        >
          <Calendar size={18} />
        </div>

        {!user ? (
          <button
            className="login-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Đăng nhập
          </button>
        ) : (
          <div className="user-dropdown" onClick={() => setOpen(!open)}>
            <div className="account-box">
              <div className="avatar">
                {user.fullName
                  ?.split(" ")
                  .map((x) => x[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h4>{user.fullName}</h4>
              </div>
              <ChevronDown size={16} />
            </div>

            {open && (
              <div className="dropdown-menu">
                <div className="dropdown-user">
                  <strong>{user.fullName}</strong>
                  <p>{user.email}</p>
                </div>
                <button onClick={handleLogout}>
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}