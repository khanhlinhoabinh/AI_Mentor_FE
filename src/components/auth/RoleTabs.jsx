import "./RoleTabs.css";

import UserIcon from "../../assets/IconRight/User.png";
import AdminIcon from "../../assets/IconRight/Admin.png";

export default function RoleTabs() {
  return (
    <div className="role-tabs">
      <button className="active">
        <img src={UserIcon} alt="User" />

        <div>
          <strong>User</strong>
          <p>Học tập với AI Mentor</p>
        </div>
      </button>

      <button>
        <img src={AdminIcon} alt="Admin" />

        <div>
          <strong>Admin</strong>
          <p>Quản trị hệ thống</p>
        </div>
      </button>
    </div>
  );
}