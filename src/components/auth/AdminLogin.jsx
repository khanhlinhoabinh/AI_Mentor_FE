import "./AdminLogin.css";

import { useState } from "react";

import LoginName from "../../assets/IconRight/LoginName.png";
import Password from "../../assets/IconRight/Password.png";
import EyeCrossed from "../../assets/IconRight/EyeCrossed.png";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="admin-box">
      <h3>Admin Login</h3>

      <p className="admin-desc">
        Đăng nhập để quản lý hệ thống AI Mentor
      </p>

      {/* Username */}

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

      {/* Password */}

      <div className="input-group">
        <label>Mật khẩu</label>

        <div className="input-wrapper">
          <img
            src={Password}
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

      {/* Remember */}

      <div className="remember">
        <label>
          <input type="checkbox" />
          Ghi nhớ đăng nhập
        </label>

        <span>Quên mật khẩu?</span>
      </div>

      {/* Login Button */}

      <button className="login-btn">
        Đăng nhập Admin
      </button>
    </div>
  );
}