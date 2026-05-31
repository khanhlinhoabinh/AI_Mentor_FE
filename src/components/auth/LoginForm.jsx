import "./LoginForm.css";

import RoleTabs from "./RoleTabs";
import UserLogin from "./UserLogin";
import AdminLogin from "./AdminLogin";

export default function LoginForm() {
  return (
    <div className="login-form-wrapper">
      <div className="login-form">

        <div className="login-header">
          <img
  src={logo}
  alt="AI Mentor"
  className="logo-img"
/>

          <h2>AI Mentor</h2>

          <p className="sub">
            Nền tảng học tập thông minh ứng dụng AI,
            hỗ trợ quản lý tài liệu, chatbot hỏi đáp,
            flashcard, quiz và cá nhân hóa lộ trình học tập.
          </p>
        </div>

        <RoleTabs />

        <UserLogin />

        <div className="divider">
          <span>HOẶC ĐĂNG NHẬP ADMIN</span>
        </div>

        <AdminLogin />

      </div>
    </div>
  );
}