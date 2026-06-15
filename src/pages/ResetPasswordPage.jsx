import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { resetPassword } from "../services/auth.services";

import "./ResetPasswordPage.css";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await resetPassword(token, newPassword);

      alert("Đổi mật khẩu thành công");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Không thể đổi mật khẩu");
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h2>Tạo mật khẩu mới</h2>

        <p>Nhập mật khẩu mới cho tài khoản Admin của bạn.</p>

        <div className="reset-input">
          <label>Mật khẩu mới</label>

          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="reset-input">
          <label>Xác nhận mật khẩu</label>

          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="reset-btn" onClick={handleReset}>
          Đổi mật khẩu
        </button>

        <div className="back-login">
          <a href="/login">← Quay lại đăng nhập</a>
        </div>
      </div>
    </div>
  );
}
