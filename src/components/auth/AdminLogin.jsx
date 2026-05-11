import "./AdminLogin.css";

export default function AdminLogin() {
  return (
    <div className="admin-box">
      <h3>Đăng nhập dành cho Admin</h3>

      <div className="input-group">
        <label>Tên đăng nhập</label>
        <input
          type="text"
          placeholder="Nhập tên đăng nhập"
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