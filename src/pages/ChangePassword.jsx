import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, ArrowLeft, ShieldCheck } from "lucide-react";
import { changePassword } from "../services/auth.services";
import styles from "./ChangePassword.module.css";

export default function ChangePassword() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword)
      return "Vui lòng điền đầy đủ thông tin.";
    if (form.newPassword.length < 6)
      return "Mật khẩu mới phải có ít nhất 6 ký tự.";
    if (form.newPassword !== form.confirmPassword)
      return "Mật khẩu xác nhận không khớp.";
    if (form.oldPassword === form.newPassword)
      return "Mật khẩu mới không được trùng mật khẩu cũ.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await changePassword(user?.email, form.oldPassword, form.newPassword);
      setSuccess(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      setError(typeof msg === "string" ? msg : "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  // Render 1 input field có toggle show/hide password
  const inputField = (label, name, showKey) => (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrap}>
        <input
          type={show[showKey] ? "text" : "password"}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className={styles.input}
          placeholder="••••••••"
          autoComplete="off"
        />
        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShow((s) => ({ ...s, [showKey]: !s[showKey] }))}
          tabIndex={-1}
        >
          {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Quay lại
        </button>
        <h1 className={styles.title}>Đổi mật khẩu</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          {/* ── Card header ── */}
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <KeyRound size={22} />
            </div>
            <div>
              <p className={styles.cardTitle}>Thay đổi mật khẩu</p>
              <p className={styles.cardSub}>
                Tài khoản:{" "}
                <span className={styles.emailHighlight}>{user?.email}</span>
              </p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* ── Success ── */}
          {success ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <ShieldCheck size={36} />
              </div>
              <p className={styles.successTitle}>Đổi mật khẩu thành công!</p>
              <p className={styles.successSub}>
                Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại nếu được yêu
                cầu.
              </p>
              <button
                className={styles.btnPrimary}
                onClick={() => navigate("/admin")}
              >
                Về trang Dashboard
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form className={styles.form} onSubmit={handleSubmit}>
              {inputField("Mật khẩu hiện tại", "oldPassword", "old")}
              {inputField("Mật khẩu mới", "newPassword", "new")}
              {inputField("Xác nhận mật khẩu mới", "confirmPassword", "confirm")}

              {/* Thanh độ mạnh mật khẩu */}
              {form.newPassword && (
                <div className={styles.strengthHint}>
                  <div
                    className={`${styles.strengthBar} ${
                      form.newPassword.length >= 12
                        ? styles.strong
                        : form.newPassword.length >= 8
                        ? styles.medium
                        : styles.weak
                    }`}
                  />
                  <span className={styles.strengthLabel}>
                    {form.newPassword.length >= 12
                      ? "Mạnh"
                      : form.newPassword.length >= 8
                      ? "Trung bình"
                      : "Yếu"}
                  </span>
                </div>
              )}

              {/* Error */}
              {error && <div className={styles.errorBox}>{error}</div>}

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => navigate(-1)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={loading}
                >
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    <>
                      <KeyRound size={15} />
                      Xác nhận đổi mật khẩu
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Sidebar tips ── */}
        <div className={styles.tips}>
          <p className={styles.tipsTitle}>Lưu ý bảo mật</p>
          <ul>
            <li>Sử dụng ít nhất 8 ký tự kết hợp chữ và số.</li>
            <li>Không dùng mật khẩu đã dùng cho dịch vụ khác.</li>
            <li>Không chia sẻ mật khẩu với bất kỳ ai.</li>
          </ul>
        </div>
      </div>
    </div>
  );
  
}