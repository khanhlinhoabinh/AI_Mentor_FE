import "./UserLogin.css";

import { GoogleLogin } from "@react-oauth/google";
import { loginGoogle } from "../../services/auth.services";
import { useNavigate } from "react-router-dom";
import { alertError, alertSuccess } from "../../utils/swal";

export default function UserLogin() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const res = await loginGoogle(idToken);

      console.log("LOGIN RESPONSE:", res);

      console.log("TOKEN:", localStorage.getItem("token"));

      localStorage.setItem("user", JSON.stringify(res));

      navigate("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      await alertError("Đăng nhập thất bại", "...");
    }
  };

  return (
    <div className="google-box">
      <h3>Đăng nhập dành cho User</h3>

      <p>Tiếp tục học tập cùng AI Mentor bằng tài khoản Google của bạn.</p>

      <div className="google-custom-btn">
        <img
          src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
          alt="Google"
        />

        <span>Tiếp tục với Google</span>

        <div className="google-real-btn">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log("Google Login Failed");

              alertError("Lỗi", "Đăng nhập Google thất bại");
            }}
          />
        </div>
      </div>
    </div>
  );
}
