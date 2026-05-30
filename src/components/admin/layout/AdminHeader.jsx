import "./AdminHeader.css";

import {
  FaBell,
  FaCog,
  FaSearch
} from "react-icons/fa";

const AdminHeader = () => {
  return (
    <header className="admin-header">

      <div className="admin-header-left">

        <h1>
          Xin chào, Admin! 👋
        </h1>

        <p>
          Đây là trung tâm điều hành hệ thống AI Mentor
        </p>

      </div>

      <div className="admin-header-right">

        <div className="admin-search">

          <FaSearch />

          <input
            placeholder="Tìm kiếm người dùng, môn học, tài liệu..."
          />

          <span>Ctrl + K</span>

        </div>

        <button className="admin-icon-btn">
          <FaBell />
        </button>

        <button className="admin-icon-btn">
          <FaCog />
        </button>

        <div className="admin-profile">

          <img
            src="https://i.pravatar.cc/150?img=12"
            alt=""
          />

          <div>

            <h4>Admin System</h4>

            <span>Super Admin</span>

          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminHeader;