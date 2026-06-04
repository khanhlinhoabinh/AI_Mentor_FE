import "./AdminLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "../../services/auth.services";
import { Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const data = await loginAdmin(email, password);

      if (data.role === "ADMIN") {
        navigate("/admin");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };
  return (
    <div className="admin-box" id="admin-login">
      <h3>Đăng nhập dành cho Admin</h3>

      <p className="admin-desc">
        Quản trị hệ thống AI Mentor và theo dõi hoạt động người dùng.
      </p>

      <div className="input-group">
        <label>Email Admin</label>

        <input
          type="email"
          placeholder="Nhập email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Mật khẩu</label>

        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="remember">
        <label>
          <input type="checkbox" />
          Ghi nhớ đăng nhập
        </label>

        <Link to="/forgot-password">Quên mật khẩu?</Link>
      </div>

      <button className="admin-login-btn" onClick={handleLogin}>
        Đăng nhập Admin
      </button>
    </div>
  );
}
