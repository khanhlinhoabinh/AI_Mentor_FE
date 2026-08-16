import { useEffect, useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SubjectCard from "../SubjectCard/SubjectCard";
import "./SubjectsGrid.css";

import { confirmDelete, toastSuccess, toastError } from "../../../utils/swal";

import { getSubjects, deleteSubject } from "../../../services/subject.services";

import CreateSubjectModal from "../CreateSubjectModal/CreateSubject";

const MAX_SUBJECTS = 5;

export default function SubjectsGrid({ sortOptions = [] }) {
  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ef4444",
    "#f59e0b",
    "#06b6d4",
    "#ec4899",
    "#14b8a6",
  ];

  // =========================
  // STATE
  // =========================
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSort, setSelectedSort] = useState(sortOptions?.[0] || "");

  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const navigate = useNavigate();

  // =========================
  // LOAD SUBJECTS
  // =========================
  const loadSubjects = async () => {
    try {
      setLoading(true);

      const data = await getSubjects();

      console.log("SUBJECTS FROM API:", data);

      // Đảm bảo subjects luôn là array
      if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        console.warn("getSubjects() không trả về array:", data);
        setSubjects([]);
      }
    } catch (error) {
      console.error("Load subjects failed:", error);

      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadSubjects();
  }, []);

  // =========================
  // VIEW DETAIL
  // =========================
  const handleViewDetail = (subjectId) => {
    if (!subjectId) {
      console.error("Subject ID không hợp lệ:", subjectId);
      return;
    }

    navigate(`/mysubjects/${subjectId}`);
  };

  // =========================
  // DELETE SUBJECT
  // =========================
  const handleDelete = async (subjectId) => {
    if (!subjectId) {
      console.error(
        "Không thể xóa môn học vì subjectId không hợp lệ:",
        subjectId,
      );
      return;
    }

    const ok = await confirmDelete(
      "Xóa môn học?",
      "Toàn bộ dữ liệu môn học sẽ bị xóa vĩnh viễn.",
    );

    if (!ok) return;

    try {
      // Gọi API xóa
      await deleteSubject(subjectId);

      // Cập nhật UI ngay lập tức
      setSubjects((prev) =>
        Array.isArray(prev)
          ? prev.filter((item) => item?.subjectId !== subjectId)
          : [],
      );

      // Thông báo sau khi xóa thành công
      await toastSuccess("Xóa môn học thành công");
    } catch (error) {
      console.error("Delete subject failed:", error);

      await toastError(
        error?.response?.data?.message || "Xóa môn học thất bại",
      );
    }
  };

  // =========================
  // MAP SUBJECT DATA
  // =========================
  const mappedSubjects = (Array.isArray(subjects) ? subjects : []).map(
    (item) => {
      // Đảm bảo subjectName luôn là string
      const name =
        typeof item?.subjectName === "string" ? item.subjectName.trim() : "";

      // Tách từ và loại bỏ phần tử rỗng
      const words = name.split(/\s+/).filter(Boolean);

      // Lấy tối đa 2 chữ cái đầu
      const initials = words
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");

      // ID an toàn
      const subjectId = item?.subjectId;

      const numericId = Number(subjectId);

      // Tính màu an toàn
      const colorIndex = Number.isFinite(numericId)
        ? Math.abs(numericId) % COLORS.length
        : 0;

      return {
        id: subjectId,
        name: name || "Không có tên",
        description: item?.description ?? "",
        initials: initials || "?",
        color: COLORS[colorIndex],
      };
    },
  );

  // =========================
  // LIMIT SUBJECTS
  // =========================
  const displayed = mappedSubjects.slice(0, MAX_SUBJECTS);

  // =========================
  // SORT OPTIONS SAFETY
  // =========================
  const safeSortOptions = Array.isArray(sortOptions) ? sortOptions : [];

  // =========================
  // CREATE SUBJECT SUCCESS
  // =========================
  const handleSubjectCreated = async () => {
    await loadSubjects();
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="sgs-wrapper">
      {/* =========================
          TITLE
      ========================= */}
      <h2 className="sgs-title">Danh sách môn học</h2>

      {/* =========================
          CONTROLS
      ========================= */}
      <div className="sgs-controls">
        <select
          className="sgs-select"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          {safeSortOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="sgs-toggle">
          {/* GRID */}
          <button
            type="button"
            className={`sgs-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            aria-label="Hiển thị dạng lưới"
          >
            <LayoutGrid size={15} />
          </button>

          {/* LIST */}
          <button
            type="button"
            className={`sgs-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            aria-label="Hiển thị dạng danh sách"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* =========================
          SUBJECT LIST
      ========================= */}
      <div className="sgs-cards-area">
        {loading ? (
          <p>Đang tải...</p>
        ) : viewMode === "grid" ? (
          /* =========================
             GRID VIEW
          ========================= */
          <div className="sgs-grid">
            {/* ADD SUBJECT */}
            <div
              className="sgs-add-card sgs-add-grid"
              onClick={() => setShowModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowModal(true);
                }
              }}
            >
              <div className="sgs-add-icon">
                <Plus size={22} />
              </div>

              <span className="sgs-add-text">Tạo môn học mới</span>
            </div>

            {/* SUBJECT CARDS */}
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
          /* =========================
             LIST VIEW
          ========================= */
          <div className="sgs-list">
            {/* ADD SUBJECT */}
            <div
              className="sgs-add-card sgs-add-list"
              onClick={() => setShowModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowModal(true);
                }
              }}
            >
              <div className="sgs-add-icon-sm">
                <Plus size={18} />
              </div>

              <span className="sgs-add-text">Tạo môn học mới</span>
            </div>

            {/* SUBJECT CARDS */}
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

      {/* =========================
          CREATE SUBJECT MODAL
      ========================= */}
      {showModal && (
        <CreateSubjectModal
          onClose={() => setShowModal(false)}
          onCreated={handleSubjectCreated}
        />
      )}
    </div>
  );
}
