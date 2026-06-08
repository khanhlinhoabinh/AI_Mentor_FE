import { useState } from "react";
import {
  Home, BookOpen, FileText, MessageCircle,
  StickyNote, Layers, PenTool, Map,
  BarChart2, Settings, Plus,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginRequiredModal
  from "../LoginRequiredModal/LoginRequiredModal";

  export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
const [showLoginModal, setShowLoginModal] =
  useState(false);
  
  const isLoggedIn = !!localStorage.getItem("token");

  const handleCreateSubject = () => {
  if (isLoggedIn) {
    navigate("/mysubjects");
  } else {
    setShowLoginModal(true);
  }
};

  const navItems = [
    { icon: Home,          label: "Trang chủ",       path: "/" },
    { icon: BookOpen,      label: "Môn học của tôi", path: "/mysubjects" },
    { icon: FileText,      label: "Tài liệu" },
    { icon: MessageCircle, label: "Chat AI" },
    { icon: StickyNote,    label: "Ghi chú" },
    { icon: Layers,        label: "Flashcard" },
    { icon: PenTool,       label: "Luyện tập" },
    { icon: Map,           label: "Lộ trình học tập" },
    { icon: BarChart2,     label: "Thống kê" },
    { icon: Settings,      label: "Cài đặt" },
  ];

  return (
    <>
      <aside className="sidebar">
        <button className="create-btn" onClick={handleCreateSubject}>
          <Plus size={16} />
          Tạo môn học
        </button>

        <div className="nav-list">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => item.path && navigate(item.path)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Modal chỉ render khi showModal = true */}
      {showLoginModal && (
  <LoginRequiredModal
    onClose={() =>
      setShowLoginModal(false)
    }
  />
)}
    </>
  );
}