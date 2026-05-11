import "./UserLogin.css";

export default function UserLogin() {
  return (
    <div className="google-box">
      <h3>Đăng nhập nhanh cho người dùng</h3>

      <button className="google-btn">
        <img
          src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
          alt=""
        />

        Đăng nhập với Google
      </button>

      <p className="safe">
        🔒 An toàn, bảo mật và không cần mật khẩu
      </p>
    </div>
  );
}