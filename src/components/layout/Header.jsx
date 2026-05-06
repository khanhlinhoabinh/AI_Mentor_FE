import "./Header.css";

export default function Header() {
  return (
    <div className="header">
      {/* LEFT */}
      <div className="header-left">
        <div className="logo">
          🌱 <span className="brand">AI Mentor</span>
          <span className="slogan">Học thông minh, tiến xa mỗi ngày</span>
        </div>
      </div>

      {/* CENTER */}
      <div className="header-center">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm môn học, tài liệu, ghi chú..."
          />
          <span className="shortcut">Ctrl + K</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        <span className="icon">🔔</span>
        <span className="icon">📅</span>

        <div className="user">
          <img src="https://i.pravatar.cc/40" alt="avatar" />
          <div className="user-info">
            <span className="name">Nguyễn Văn A</span>
            <span className="badge">Premium</span>
          </div>
        </div>
      </div>
    </div>
  );
}
