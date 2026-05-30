
import "./AdminLogin.css";

export default function AdminLogin() {
  return (
    <div className="admin-box">
      <h3>Đăng nhập dành cho Admin</h3>

      <p className="admin-desc">
        Quản trị hệ thống AI Mentor và theo dõi hoạt động người dùng.
      </p>

      <div className="input-group">
        <label>Email Admin</label>

        <input
          type="email"
          placeholder="Nhập email admin"
        />
      </div>

      <div className="input-group">
        <label>Mật khẩu</label>

        <input
          type="password"
          placeholder="Nhập mật khẩu"
        />
      </div>

      <div className="remember">
        <label>
          <input type="checkbox" />
          Ghi nhớ đăng nhập
        </label>

        <span>Quên mật khẩu?</span>
      </div>

      <button className="login-btn">
        Đăng nhập Admin
      </button>
    </div>
  );
}