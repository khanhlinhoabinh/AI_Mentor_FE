
import "./LoginForm.css";

import RoleTabs from "./RoleTabs";
import UserLogin from "./UserLogin";
import AdminLogin from "./AdminLogin";

export default function LoginForm() {
  return (
    <div className="login-form-wrapper">
      <div className="login-form">
        <h2>Welcome to AI Mentor 🌱</h2>

        <RoleTabs />

        <UserLogin />

        <div className="divider">
          <span>Hoặc đăng nhập với Admin</span>
        </div>

        <AdminLogin />
      </div>
    </div>
  );
}