import "./SubjectTabs.css";

const TABS = [
  "Tổng quan",
  "Tài liệu",
  "Flashcard",
  "Quiz và Luyện tập",
  "Lộ trình học tập",
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