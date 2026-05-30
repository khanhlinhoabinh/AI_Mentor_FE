import "./AdminSidebar.css";

import {
  FaThLarge,
  FaUsers,
  FaBook,
  FaFileAlt,
  FaClipboardCheck,
  FaRoad,
  FaChartLine,
  FaBell,
  FaShieldAlt,
  FaFlag,
  FaChartPie,
  FaHistory,
  FaDatabase,
  FaRobot,
  FaChevronRight
} from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">

      <div className="admin-logo">

        <div className="admin-logo-icon">
          <FaRobot />
        </div>

        <div>
          <h2>AI Mentor</h2>
          <span>Admin Dashboard</span>
        </div>

      </div>

      <div className="admin-menu-group">

        <div className="admin-menu-title">
          QUẢN LÝ HỆ THỐNG
        </div>

        <ul>

          <li className="active">
            <FaThLarge />
            <span>Tổng quan</span>
            <FaChevronRight />
          </li>

          <li>
            <FaUsers />
            <span>Người dùng</span>
            <FaChevronRight />
          </li>

          <li>
            <FaBook />
            <span>Môn học</span>
            <FaChevronRight />
          </li>

          <li>
            <FaFileAlt />
            <span>Tài liệu học tập</span>
            <FaChevronRight />
          </li>

          <li>
            <FaClipboardCheck />
            <span>Flashcard & Quiz</span>
            <FaChevronRight />
          </li>

          <li>
            <FaRoad />
            <span>Roadmap học tập</span>
            <FaChevronRight />
          </li>

          <li>
            <FaChartLine />
            <span>Tiến độ học tập</span>
            <FaChevronRight />
          </li>

          <li>
            <FaBell />
            <span>Nhắc nhở</span>
            <FaChevronRight />
          </li>

        </ul>

      </div>

      <div className="admin-menu-group">

        <div className="admin-menu-title">
          KIỂM DUYỆT & BẢO MẬT
        </div>

        <ul>

          <li>
            <FaShieldAlt />
            <span>Nội dung vi phạm</span>

            <div className="admin-badge">
              3
            </div>
          </li>

          <li>
            <FaFlag />
            <span>Báo cáo hệ thống</span>
          </li>

        </ul>

      </div>

      <div className="admin-menu-group">

        <div className="admin-menu-title">
          THỐNG KÊ & BÁO CÁO
        </div>

        <ul>

          <li>
            <FaChartPie />
            <span>Thống kê chi tiết</span>
          </li>

          <li>
            <FaHistory />
            <span>Nhật ký hoạt động</span>
          </li>

          <li>
            <FaDatabase />
            <span>Sao lưu dữ liệu</span>
          </li>

        </ul>

      </div>

      <div className="admin-premium-card">

        <div className="admin-premium-icon">
          <FaRobot />
        </div>

        <h3>AI Mentor Premium</h3>

        <p>
          Mở khóa toàn bộ tính năng nâng cao
        </p>

        <button>
          Nâng cấp ngay
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;