import "./UserLogin.css";

import { GoogleLogin } from "@react-oauth/google";
import { loginGoogle } from "../../services/auth.services";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const res = await loginGoogle(idToken);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res));

      navigate("/");
    } catch (error) {
      console.error(error);

      alert("Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className="google-box">
      <h3>Đăng nhập nhanh cho người dùng</h3>

      <p>
        Sử dụng tài khoản Google để đăng nhập nhanh chóng và an toàn
      </p>

      <div className="google-custom-btn">
        <img
          src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
          alt="Google"
        />

        <span>Đăng nhập với Google</span>

        <div className="google-real-btn">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              alert("Không thể đăng nhập bằng Google");
            }}
          />
        </div>
      </div>

      <p className="safe">
        🔒 An toàn, bảo mật và không cần mật khẩu
      </p>
    </div>
  );
}