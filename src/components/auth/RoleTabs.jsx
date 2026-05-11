import "./RoleTabs.css";

export default function RoleTabs() {
  return (
    <div className="role-tabs">
      <button className="active">
        👤 Người dùng
      </button>

      <button>
        🛡 Admin
      </button>
    </div>
  );
}