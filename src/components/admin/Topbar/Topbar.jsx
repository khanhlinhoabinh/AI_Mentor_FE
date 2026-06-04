import styles from "./Topbar.module.css";
import {
  MdSearch,
  MdNotifications,
  MdSettings,
  MdKeyboardArrowDown,
} from "react-icons/md";

import { LogOut, KeyRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const initials =
    user?.fullName
      ?.split(" ")
      .map((x) => x[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.greeting}>
          Dashboard
        </h1>
      </div>

      <div className={styles.searchWrap}>
        <MdSearch
          size={20}
          className={styles.searchIcon}
        />

        <input
          className={styles.searchInput}
          placeholder="Tìm kiếm người dùng..."
        />

        <kbd className={styles.searchKbd}>
          Ctrl + K
        </kbd>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn}>
          <MdNotifications size={20} />
          <span className={styles.notifBadge}>
            8
          </span>
        </button>

        <button className={styles.iconBtn}>
          <MdSettings size={20} />
        </button>

        <div
          className={styles.userDropdown}
        >
          <div
            className={styles.userPill}
            onClick={() => setOpen(!open)}
          >
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>
                {initials}
              </div>

              <span
                className={
                  styles.avatarOnline
                }
              />
            </div>

            <div className={styles.userInfo}>
              <span
                className={styles.userName}
              >
                {user?.fullName}
              </span>

              <span
                className={styles.userRole}
              >
                {user?.role}
              </span>
            </div>

            <MdKeyboardArrowDown
              size={16}
              className={styles.userChev}
            />
          </div>

          {open && (
            <div
              className={
                styles.dropdownMenu
              }
            >
              <div
                className={
                  styles.dropdownUser
                }
              >
                <strong>
                  {user?.fullName}
                </strong>

                <p>{user?.email}</p>
              </div>

              <button
                onClick={() =>
                  navigate(
                    "/admin/change-password"
                  )
                }
              >
                <KeyRound size={16} />
                Đổi mật khẩu
              </button>

              <button
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}