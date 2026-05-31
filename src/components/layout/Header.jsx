import {
  Search,
  Bell,
  Calendar,
} from "lucide-react";

export default function Header() {
  return (
    <header className="top-header">
      <div className="logo">
        <div className="logo-icon">🌿</div>

        <div>
          <h1>AI Mentor</h1>
        </div>
      </div>

      <div className="search-box">
        <Search size={18} />

        <input
          type="text"
          placeholder="Tìm kiếm môn học, tài liệu..."
        />
      </div>

      <div className="top-actions">
        <div className="top-icon">
          <Bell size={18} />
        </div>

        <div className="top-icon">
          <Calendar size={18} />
        </div>

        <div className="account-box">
          <div className="avatar">NVA</div>

          <div>
            <h4>Nguyễn Văn A</h4>
          </div>
        </div>
      </div>
    </header>
  );
}