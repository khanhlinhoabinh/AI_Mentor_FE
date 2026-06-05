import "./Sidebar.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">AI Mentor</h2>

      <button className="create-btn">
        + Tạo môn học
      </button>

      <ul className="menu">
        <li>
          <NavLink to="/">
            Trang chủ
          </NavLink>
        </li>

        <li>
          <NavLink to="/courses">
            Môn học của tôi
          </NavLink>
        </li>

        <li>
          <NavLink to="/documents">
            Tài liệu
          </NavLink>
        </li>

        <li>
          <NavLink to="/chat">
            Chat AI
          </NavLink>
        </li>

        <li>
          <NavLink to="/flashcard">
            Flashcard
          </NavLink>
        </li>
      </ul>
    </div>
  );
}