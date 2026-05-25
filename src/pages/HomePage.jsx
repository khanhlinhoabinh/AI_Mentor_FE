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
  Search,
  Bell,
  Calendar,
} from "lucide-react";

import "../styles/Dashboard.css";

export default function HomePage() {
  const navItems = [
    { icon: Home, label: "Trang chủ" },
    { icon: BookOpen, label: "Môn học của tôi" },
    { icon: FileText, label: "Tài liệu" },
    { icon: MessageCircle, label: "Chat AI" },
    { icon: StickyNote, label: "Ghi chú" },
    { icon: Layers, label: "Flashcard" },
    { icon: PenTool, label: "Luyện tập" },
    { icon: Map, label: "Lộ trình học tập" },
    { icon: BarChart2, label: "Thống kê" },
    { icon: Settings, label: "Cài đặt" },
  ];

  const subjects = [
    {
      title: "Cấu trúc dữ liệu & Giải thuật",
      progress: 65,
      docs: 12,
      icon: "⚙️",
    },
    {
      title: "Cơ sở dữ liệu",
      progress: 40,
      docs: 8,
      icon: "🗄️",
    },
    {
      title: "Trí tuệ nhân tạo",
      progress: 75,
      docs: 15,
      icon: "🤖",
    },
    {
      title: "Toán rời rạc",
      progress: 30,
      docs: 6,
      icon: "📐",
    },
  ];

  return (
    <div className="page">
      {/* HEADER */}
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

      <div className="dashboard">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <button className="create-btn">
            <Plus size={16} />
            Tạo môn học
          </button>

          <p className="menu-title">MENU CHÍNH</p>

          <div className="nav-list">
            {navItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className={`nav-item ${index === 0 ? "active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          {/* HERO */}
          <div className="hero">
            <div>
              <h2>Chào mừng trở lại 👋</h2>

              <p>Hôm nay bạn muốn học gì nào?</p>

              <div className="quote-box">
                "Bạn không cần phải giỏi ngay từ đầu, nhưng bạn phải bắt đầu
                để trở nên giỏi hơn mỗi ngày."
              </div>
            </div>

            <div className="hero-avatar">🧑‍💻</div>
          </div>

          {/* SUBJECT */}
          <section className="section">
            <div className="section-header">
              <h3>Môn học của tôi</h3>

              <button>Xem tất cả</button>
            </div>

            <div className="subject-grid">
              {subjects.map((item, index) => (
                <div className="subject-card" key={index}>
                  <div className="subject-more">⋮</div>

                  <div className="subject-icon">{item.icon}</div>

                  <h4>{item.title}</h4>

                  <div className="progress-wrapper">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.progress}%`,
                        }}
                      ></div>
                    </div>

                    <div className="subject-footer">
                      <span>{item.progress}%</span>

                      <span>{item.docs} tài liệu</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* QUICK ACCESS */}
          <section className="section">
            <div className="section-header">
              <h3>Truy cập nhanh</h3>
            </div>

            <div className="quick-grid">
              <div className="quick-card">
                <div>
                  <div className="quick-icon green">🤖</div>

                  <h4>Chat với AI</h4>

                  <p>Hỏi bài, giải thích kiến thức mọi lúc</p>
                </div>

                <span>Bắt đầu chat →</span>
              </div>

              <div className="quick-card">
                <div>
                  <div className="quick-icon blue">📄</div>

                  <h4>Tóm tắt tài liệu</h4>

                  <p>Tóm tắt nhanh nội dung bằng AI</p>
                </div>

                <span>Tóm tắt ngay →</span>
              </div>

              <div className="quick-card">
                <div>
                  <div className="quick-icon purple">🧠</div>

                  <h4>Tạo Flashcard</h4>

                  <p>Tạo thẻ ghi nhớ thông minh</p>
                </div>

                <span>Tạo thẻ mới →</span>
              </div>

              <div className="quick-card">
                <div>
                  <div className="quick-icon orange">✍️</div>

                  <h4>Luyện tập</h4>

                  <p>Làm bài tập và kiểm tra kiến thức</p>
                </div>

                <span>Luyện tập →</span>
              </div>
            </div>
          </section>

          {/* DOCS */}
          <section className="section">
            <div className="section-header">
              <h3>Tài liệu học tập gần đây</h3>

              <button>Xem tất cả</button>
            </div>

            <div className="docs-grid">
              <div className="doc-card">
                <div className="doc-icon red">📕</div>

                <div>
                  <h4>Cấu trúc dữ liệu.pdf</h4>
                  <p>PDF • 2.4 MB • 2 giờ trước</p>
                </div>
              </div>

              <div className="doc-card">
                <div className="doc-icon red">📕</div>

                <div>
                  <h4>SQL cơ bản.pdf</h4>
                  <p>PDF • 1.8 MB • 1 ngày trước</p>
                </div>
              </div>

              <div className="doc-card">
                <div className="doc-icon blue">📘</div>

                <div>
                  <h4>Machine Learning.docx</h4>
                  <p>DOCX • 3.1 MB • 2 ngày trước</p>
                </div>
              </div>

              <div className="doc-card">
                <div className="doc-icon orange">📙</div>

                <div>
                  <h4>Toán rời rạc.pptx</h4>
                  <p>PPTX • 4.2 MB • 3 ngày trước</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* RIGHT PANEL */}
        <aside className="right-panel">
          {/* SCHEDULE */}
<div className="panel-card">
  <div className="panel-header">
    <h3>Lịch học hôm nay</h3>

    <button>Xem lịch</button>
  </div>

  <div className="schedule-list">
    <div className="schedule-card green">
      <div className="schedule-time">
        <span>09:00</span>
        <small>10:30</small>
      </div>

      <div className="schedule-info">
        <h4>Cấu trúc dữ liệu & Giải thuật</h4>
        <p>Học</p>
      </div>
    </div>

    <div className="schedule-card yellow">
      <div className="schedule-time">
        <span>14:00</span>
        <small>15:30</small>
      </div>

      <div className="schedule-info">
        <h4>Cơ sở dữ liệu</h4>
        <p>Ôn tập</p>
      </div>
    </div>

    <div className="schedule-card blue">
      <div className="schedule-time">
        <span>19:30</span>
        <small>20:30</small>
      </div>

      <div className="schedule-info">
        <h4>AI Machine Learning</h4>
        <p>Luyện tập</p>
      </div>
    </div>
  </div>
</div>

          {/* PROGRESS */}
          <div className="panel-card">
            <div className="panel-header">
              <h3>Tiến độ học tập</h3>
            </div>

            <div className="circle-progress">
              68%
            </div>

            <p className="progress-text">
              Bạn đã học 18/26 buổi
            </p>

            <div className="mini-chart">
              <div className="chart-bar h1"></div>
              <div className="chart-bar h2"></div>
              <div className="chart-bar h3"></div>
              <div className="chart-bar h4 active"></div>
              <div className="chart-bar h5"></div>
              <div className="chart-bar h6"></div>
              <div className="chart-bar h7"></div>
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="panel-card">
            <div className="panel-header">
              <h3>Thành tích</h3>

              <button>Xem tất cả</button>
            </div>

            <div className="achievement-item">
              <div className="achievement-icon">🔥</div>

              <div>
                <h4>Chuỗi ngày học tập</h4>
                <p>12 ngày liên tiếp</p>
              </div>
            </div>

            <div className="achievement-item">
              <div className="achievement-icon">🏆</div>

              <div>
                <h4>Thành tích đạt được</h4>
                <p>8/12 huy hiệu</p>
              </div>
            </div>

            <div className="achievement-item">
              <div className="achievement-icon">📚</div>

              <div>
                <h4>Tài liệu đã đọc</h4>
                <p>47 tài liệu tháng này</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}