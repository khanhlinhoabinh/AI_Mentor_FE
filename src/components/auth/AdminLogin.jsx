import "./AdminLogin.css";
import { useState } from "react";

import LoginName from "../../assets/IconRight/LoginName.png";
import PasswordIcon from "../../assets/IconRight/PassWord.png";
import EyeCrossed from "../../assets/IconRight/EyeCrossed.png";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="admin-box">
      <h3>Admin Login</h3>

      <p className="admin-desc">
        Đăng nhập để quản lý hệ thống AI Mentor
      </p>

      <div className="input-group">
        <label>Tên đăng nhập</label>

        <div className="input-wrapper">
          <img
            src={LoginName}
            alt="username"
            className="input-icon"
          />

          <input
            type="text"
            placeholder="Nhập tên đăng nhập"
          />
        </div>
      </div>

      <div className="input-group">
        <label>Mật khẩu</label>

        <div className="input-wrapper">
          <img
            src={PasswordIcon}
            alt="password"
            className="input-icon"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            <img
              src={EyeCrossed}
              alt="toggle password"
            />
          </button>
        </div>
      </div>

      <div className="remember">
        <label className="remember-label">
          <input type="checkbox" />
          <span>Ghi nhớ đăng nhập</span>
        </label>

        <span className="forgot-password">
          Quên mật khẩu?
        </span>
      </div>

      <button className="login-btn">
        Đăng nhập Admin
      </button>
    </div>
  );
}