import "./LoginForm.css";

import RoleTabs from "./RoleTabs";
import UserLogin from "./UserLogin";
import AdminLogin from "./AdminLogin";

export default function LoginForm() {
  return (
    <div className="login-form-wrapper">
      <div className="login-form">
        <h2>Đăng nhập 🌱</h2>

        <p className="sub">
          Chọn phương thức đăng nhập phù hợp
        </p>

        <RoleTabs />

        <UserLogin />

        <div className="divider">
          <span>Hoặc</span>
        </div>

        <AdminLogin />
      </div>
    </div>
  );
}