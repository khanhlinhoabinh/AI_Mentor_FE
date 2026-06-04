
import "./RoleTabs.css";

export default function RoleTabs() {
   const scrollToAdmin = () => {
    const adminSection =
      document.getElementById("admin-login");

    if (adminSection) {
      adminSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };
  return (
    <div className="role-tabs">
      <button className="active">

        <div>
          <strong>User</strong>
          <p>Học tập với AI Mentor</p>
        </div>
      </button>

      <button onClick={scrollToAdmin}>

        <div>
          <strong>Admin</strong>
          <p>Quản trị hệ thống</p>
        </div>
      </button>
    </div>
  );
}