import {
  Home,
  BookOpen,
  FileText,
  MessageCircle,
  StickyNote,
  Layers,
  PenTool,
  Map,
  BarChart2,
  Settings,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Sidebar() {
    const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Trang chủ", path: "/", },
    { icon: BookOpen, label: "Môn học của tôi",path: "/mysubjects", },
    { icon: FileText, label: "Tài liệu" },
    { icon: MessageCircle, label: "Chat AI" },
    { icon: StickyNote, label: "Ghi chú" },
    { icon: Layers, label: "Flashcard" },
    { icon: PenTool, label: "Luyện tập" },
    { icon: Map, label: "Lộ trình học tập" },
    { icon: BarChart2, label: "Thống kê" },
    { icon: Settings, label: "Cài đặt" },
  ];

  return (
    <aside className="sidebar">
      <button className="create-btn">
        <Plus size={16} />
        Tạo môn học
      </button>

      <div className="nav-list">
        {navItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`nav-item ${
                index === 0 ? "active" : ""
              }`}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                }
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}