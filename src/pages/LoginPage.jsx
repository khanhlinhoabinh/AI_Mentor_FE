import LoginLeft from "../components/auth/LoginLeft";
import LoginForm from "../components/auth/LoginForm.jsx";

import "../components/auth/login.css";
export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <LoginLeft />
        <LoginForm />
      </div>

      <div className="login-footer">
        <p>© 2024 AI Mentor. Tất cả quyền được bảo lưu.</p>

        <div className="footer-links">
          <span>Điều khoản sử dụng</span>
          <span>•</span>
          <span>Chính sách bảo mật</span>
          <span>•</span>
          <span>Liên hệ hỗ trợ</span>
        </div>
      </div>
    </div>
  );
}