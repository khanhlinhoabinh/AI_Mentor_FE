
const alerts = [
  {
    title: "3 tài liệu bị báo cáo",
    time: "10 phút trước"
  },
  {
    title: "5 người dùng chưa xác thực email",
    time: "25 phút trước"
  },
  {
    title: "2 tài khoản đăng nhập bất thường",
    time: "1 giờ trước"
  }
];

const AdminAlertPanel = () => {
  return (
    <div className="admin-side-card">

      <div className="admin-side-header">

        <h3>Cảnh báo hệ thống</h3>

        <button>
          Xem tất cả
        </button>

      </div>

      {alerts.map((item, index) => (
        <div
          className="admin-alert-item"
          key={index}
        >
          <div>
            <h4>{item.title}</h4>
            <p>Cần kiểm tra</p>
          </div>

          <span>{item.time}</span>
        </div>
      ))}

    </div>
  );
};

export default AdminAlertPanel;