
const data = [
  "User123 đã upload tài liệu mới",
  "Admin đã khóa tài khoản user456",
  "Quiz mới được tạo: Cơ sở dữ liệu",
  "User789 đã hoàn thành bài quiz",
  "Backup dữ liệu hệ thống"
];

const AdminRecentActivity = () => {
  return (
    <div className="admin-side-card">

      <div className="admin-side-header">

        <h3>Hoạt động gần đây</h3>

        <button>
          Xem tất cả
        </button>

      </div>

      {data.map((item, index) => (
        <div
          key={index}
          className="admin-activity-item"
        >
          {item}
        </div>
      ))}

    </div>
  );
};

export default AdminRecentActivity;