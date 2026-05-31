import "./RoleTabs.css";

import UserIcon from "../../assets/IconRight/user.png";
import AdminIcon from "../../assets/IconRight/admin.png";

export default function RoleTabs() {
  return (
    <div className="role-tabs">

      <button className="active" type="button">
        <img
          src={UserIcon}
          alt="User"
        />

        <div className="role-content">
          <strong>User</strong>
          <p>Học tập với AI Mentor</p>
        </div>
      </button>

      <button type="button">
        <img
          src={AdminIcon}
          alt="Admin"
        />

        <div className="role-content">
          <strong>Admin</strong>
          <p>Quản trị hệ thống</p>
        </div>
      </button>

    </div>
  );
}