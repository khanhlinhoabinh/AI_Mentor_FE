import { useNavigate } from "react-router-dom";
import { MessageCircle, FileText, Layers, PenTool, ArrowRight } from "lucide-react";

const QUICK_ITEMS = [
  {
    key: "chat",
    icon: MessageCircle,
    color: "green",
    iconColor: "#16A34A",
    title: "Chat với AI",
    desc: "Hỏi bài, giải thích kiến thức mọi lúc",
    cta: "Bắt đầu chat",
    path: "/chat",
  },
  {
    key: "summary",
    icon: FileText,
    color: "blue",
    iconColor: "#2563EB",
    title: "Tóm tắt tài liệu",
    desc: "Tóm tắt nhanh nội dung bằng AI",
    cta: "Tóm tắt ngay",
    // Chưa có trang tóm tắt tài liệu riêng -> đưa vào Chat AI để hỏi tóm tắt
    path: "/chat",
  },
  {
    key: "flashcard",
    icon: Layers,
    color: "purple",
    iconColor: "#7C3AED",
    title: "Tạo Flashcard",
    desc: "Tạo thẻ ghi nhớ thông minh",
    cta: "Tạo thẻ mới",
    path: "/flashcards/new",
  },
  {
    key: "practice",
    icon: PenTool,
    color: "orange",
    iconColor: "#D97706",
    title: "Luyện tập",
    desc: "Làm bài tập và kiểm tra kiến thức",
    cta: "Luyện tập",
    path: "/quiz",
  },
];

export default function QuickAccess() {
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="section-header">
        <h3>Truy cập nhanh</h3>
      </div>

      <div className="quick-grid">
        {QUICK_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="quick-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(item.path)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(item.path);
              }}
            >
              <div>
                <div className={`quick-icon ${item.color}`}>
                  <Icon size={26} color={item.iconColor} strokeWidth={2} />
                </div>

                <h4>{item.title}</h4>

                <p>{item.desc}</p>
              </div>

              <span>
                {item.cta} <ArrowRight size={14} />
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
