
import "./RoleTabs.css";

export default function RoleTabs() {
  return (
    <div className="role-tabs">
      <button className="active">
        <span>👤</span>

        <div>
          <strong>User</strong>
          <p>Học tập với AI Mentor</p>
        </div>
      </button>

      <button>
        <span>🛡️</span>

        <div>
          <strong>Admin</strong>
          <p>Quản trị hệ thống</p>
        </div>
      </button>
    </div>
  );
}