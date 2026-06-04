import { useState } from "react";
import { forgotPassword } from "../services/auth.services";

import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await forgotPassword(email);

      alert("Đã gửi email khôi phục mật khẩu");
    } catch (error) {
      alert(error.response?.data?.message || "Không gửi được email");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2>Quên mật khẩu</h2>

        <p>Nhập email Admin để nhận liên kết đặt lại mật khẩu.</p>

        <div className="forgot-input">
          <label>Email</label>

          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit} className="forgot-btn">
          Gửi Email Khôi Phục
        </button>
        <div className="back-login">
          <a href="/login">← Quay lại đăng nhập</a>
        </div>
      </div>
    </div>
  );
}
