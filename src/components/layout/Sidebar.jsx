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
  const [modalContent, setModalContent] =
    useState({});

  const isLoggedIn = !!localStorage.getItem("token");

  const handleCreateSubject = () => {
    if (isLoggedIn) {
      navigate("/mysubjects");
    } else {
      setModalContent({
        title: "Bạn chưa có môn học nào! 📚",
        subtitle:
          "Hãy đăng nhập để tạo môn học đầu tiên và bắt đầu hành trình học tập cùng AI Mentor.",
      });

      setShowLoginModal(true);
    }
  };
  const handleNavigate = (path) => {

    if (path === "/") {
      navigate(path);
      return;
    }

    if (!isLoggedIn) {

      setModalContent({
        title: "Đăng nhập để khám phá AI Mentor ✨",
        subtitle:
          "Đăng nhập để sử dụng các tính năng như môn học, flashcard, chat AI, luyện tập và nhiều công cụ học tập thông minh khác.",
      });

      setShowLoginModal(true);
      return;
    }

    navigate(path);
  };

  const navItems = [
    { icon: Home, label: "Trang chủ", path: "/" },
    { icon: BookOpen, label: "Môn học của tôi", path: "/mysubjects" },
    { icon: MessageCircle, label: "Chat AI", path: "/chat" },
    { icon: StickyNote, label: "Ghi chú", path: "/notes" },
    { icon: Layers, label: "Flashcard", path: "/flashcards" },
    { icon: PenTool, label: "Luyện tập", path: "/practice"  },
    { icon: Map, label: "Lộ trình học tập", path: "/roadmap" },
    { icon: BarChart2, label: "Thống kê", path: "/statistics" },
    { icon: Settings, label: "Cài đặt", path: "/settings" },
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
                onClick={() =>
                  item.path &&
                  handleNavigate(item.path)
                }              >
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
          onClose={() => setShowLoginModal(false)}
          title={modalContent.title}
          subtitle={modalContent.subtitle}
        />
      )}
    </>
  );
}