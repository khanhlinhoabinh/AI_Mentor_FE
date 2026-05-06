import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">AI Mentor</h2>

      <button className="create-btn">+ Tạo môn học</button>

      <ul className="menu">
        <li className="active">Trang chủ</li>
        <li>Môn học của tôi</li>
        <li>Tài liệu</li>
        <li>Chat AI</li>
        <li>Flashcard</li>
      </ul>
    </div>
  );
}