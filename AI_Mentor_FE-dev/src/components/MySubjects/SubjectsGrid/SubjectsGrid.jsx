import { useState } from "react";
import { LayoutGrid, List, Plus, MoreVertical } from "lucide-react";
import SubjectCard from "../SubjectCard/SubjectCard";
import "./SubjectsGrid.css";

const MAX_SUBJECTS = 5;

export default function SubjectsGrid({ subjects, categories, sortOptions }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedSort, setSelectedSort]         = useState(sortOptions[0]);
  const [viewMode, setViewMode]                 = useState("grid");

  const filtered =
    selectedCategory === "Tất cả danh mục"
      ? subjects
      : subjects.filter((s) => s.category === selectedCategory);

  const displayed = filtered.slice(0, MAX_SUBJECTS);

  return (
    <div className="sgs-wrapper">
      {/* ── Title ── */}
      <h2 className="sgs-title">Danh sách môn học</h2>

      {/* ── Controls ── */}
      <div className="sgs-controls">
        <select
          className="sgs-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="sgs-select"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          {sortOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="sgs-toggle">
          <button
            className={`sgs-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            className={`sgs-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* ── Cards area ── */}
      <div className="sgs-cards-area">
        {viewMode === "grid" ? (
          /* ════ GRID MODE ════ */
          <div className="sgs-grid">
            {/* Card tạo mới — grid */}
            <div className="sgs-add-card sgs-add-grid">
              <div className="sgs-add-icon">
                <Plus size={22} />
              </div>
              <span className="sgs-add-text">Tạo môn học mới</span>
            </div>

            {displayed.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} viewMode="grid" />
            ))}
          </div>
        ) : (
          /* ════ LIST MODE ════ */
          <div className="sgs-list">
            {/* Card tạo mới — list */}
            <div className="sgs-add-card sgs-add-list">
              <div className="sgs-add-icon-sm">
                <Plus size={18} />
              </div>
              <span className="sgs-add-text">Tạo môn học mới</span>
            </div>

            {displayed.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} viewMode="list" />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="sgs-footer">
        <button className="sgs-view-all-btn">
          Xem tất cả môn học ({subjects.length}) →
        </button>
      </div>
    </div>
  );
}