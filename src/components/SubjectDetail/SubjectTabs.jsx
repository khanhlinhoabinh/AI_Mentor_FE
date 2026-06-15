import "./SubjectTabs.css";

const TABS = [
  "Tổng quan",
  "Tài liệu",
  "Ghi chú",
  "Chat AI",
  "Flashcard",
  "Luyện tập",
  "Lộ trình học tập",
  "Thống kê",
];

export default function SubjectTabs({ activeTab, onTabChange }) {
  return (
    <div className="st-tabs-bar">
      {TABS.map((tab) => (
        <button
          key={tab}
          className={`st-tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}