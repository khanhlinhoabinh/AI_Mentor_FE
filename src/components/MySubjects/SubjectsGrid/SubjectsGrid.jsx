import { useEffect, useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SubjectCard from "../SubjectCard/SubjectCard";
import "./SubjectsGrid.css";
import {
  getSubjects,
  deleteSubject,
} from "../../../services/subject.services";
import CreateSubjectModal from "../CreateSubjectModal/CreateSubject";

const MAX_SUBJECTS = 5;

export default function SubjectsGrid({ sortOptions }) {
  const COLORS = [
    "#22c55e", "#3b82f6", "#8b5cf6", "#ef4444",
    "#f59e0b", "#06b6d4", "#ec4899", "#14b8a6",
  ];
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleViewDetail = (subjectId) => {
    navigate(`/mysubjects/${subjectId}`);
  };

  const handleDelete = async (subjectId) => {
    if (!window.confirm("Bạn có chắc muốn xóa môn học này?")) return;

    try {
      await deleteSubject(subjectId);
      setSubjects((prev) => prev.filter((item) => item.subjectId !== subjectId));
      alert("Xóa môn học thành công");
    } catch (error) {
      console.error(error);
      alert("Xóa môn học thất bại");
    }
  };

  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Load subjects failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const mappedSubjects = subjects.map((item) => ({
    id: item.subjectId,
    name: item.subjectName,
    description: item.description,
    initials: item.subjectName
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((word) => word[0].toUpperCase())
      ?.join(""),
    color: COLORS[item.subjectId % COLORS.length],
  }));

  const displayed = mappedSubjects.slice(0, MAX_SUBJECTS);

  return (
    <div className="sgs-wrapper">
      <h2 className="sgs-title">Danh sách môn học</h2>

      <div className="sgs-controls">
        <select
          className="sgs-select"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          {sortOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="sgs-toggle">
          <button
            className={`sgs-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid size={15} />
          </button>

          <button
            className={`sgs-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      <div className="sgs-cards-area">
        {loading ? (
          <p>Đang tải...</p>
        ) : viewMode === "grid" ? (
          <div className="sgs-grid">
            <div className="sgs-add-card sgs-add-grid" onClick={() => setShowModal(true)}>
              <div className="sgs-add-icon">
                <Plus size={22} />
              </div>
              <span className="sgs-add-text">Tạo môn học mới</span>
            </div>

            {displayed.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                viewMode="grid"
                onViewDetail={handleViewDetail}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="sgs-list">
            <div className="sgs-add-card sgs-add-list" onClick={() => setShowModal(true)}>
              <div className="sgs-add-icon-sm">
                <Plus size={18} />
              </div>
              <span className="sgs-add-text">Tạo môn học mới</span>
            </div>

            {displayed.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                viewMode="list"
                onViewDetail={handleViewDetail}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateSubjectModal
          onClose={() => setShowModal(false)}
          onCreated={() => loadSubjects()}
        />
      )}
    </div>
  );
}