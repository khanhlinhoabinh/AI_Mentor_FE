import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFlashcardSets,
  deleteFlashcardSet,
} from "../../../services/flashcard.services";
import "./FlashcardLibrary.css";
import { confirmDelete } from "../../../utils/swal";

const FlashcardLibrary = ({ onBack, onStudy }) => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadSets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFlashcardSets();
      setSets(res.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải thư viện flashcard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSets();
  }, []);

  const handleDelete = async (e, setId) => {
    e.stopPropagation();
    const ok = await confirmDelete(
      "Xóa bộ Flashcard?",
      "Tất cả thẻ trong bộ này sẽ bị xóa vĩnh viễn.",
    );
    if (!ok) return;
    setDeletingId(setId);
    try {
      await deleteFlashcardSet(setId);
      await loadSets();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa bộ flashcard.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (e, setId) => {
    e.stopPropagation();
    window.location.href = `/flashcard-sets/${setId}/edit`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getSourceLabel = (sourceType) => {
    if (sourceType === "AI") return "AI";
    if (sourceType === "MANUAL") return "Thủ công";
    return "—";
  };

  return (
    <div className="flashcard-library">
      {/* Header */}
      <div className="flashcard-library__header">
        <button
          type="button"
          className="flashcard-library__back-btn"
          onClick={onBack}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Quay lại
        </button>
        <h2 className="flashcard-library__title">Thư viện Flashcard</h2>
        <span className="flashcard-library__count">{sets.length} bộ</span>
      </div>

      {/* Error */}
      {error && (
        <div className="flashcard-library__state flashcard-library__state--error">
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flashcard-library__state">
          <span>Đang tải...</span>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && sets.length === 0 && (
        <div className="flashcard-library__state">
          <span>Bạn chưa có bộ flashcard nào. Hãy tạo bộ đầu tiên!</span>
        </div>
      )}

      {/* List */}
      {!loading && sets.length > 0 && (
        <div className="flashcard-library__list">
          {sets.map((set) => (
            <div
              key={set.flashcardSetId}
              className="flashcard-library__item"
              onClick={() => onStudy(set.flashcardSetId)}
              title="Bấm để học thử"
            >
              <div className="flashcard-library__item-left">
                <div className="flashcard-library__item-icon">📋</div>
                <div className="flashcard-library__item-info">
                  <p className="flashcard-library__item-name">{set.setName}</p>
                  {set.description && (
                    <p className="flashcard-library__item-desc">
                      {set.description}
                    </p>
                  )}
                  <p className="flashcard-library__item-meta">
                    {formatDate(set.createdAt)}
                    &nbsp;·&nbsp;{set.totalCards} thẻ &nbsp;·&nbsp;
                    {getSourceLabel(set.sourceType)}
                  </p>
                </div>
              </div>

              <div className="flashcard-library__item-right">
                {/* Nút Học thử */}
                <button
                  type="button"
                  className="flashcard-library__study-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStudy(set.flashcardSetId);
                  }}
                  title="Học thử"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Học thử
                </button>

                {/* Nút Sửa */}
                <button
                  type="button"
                  className="flashcard-library__edit-btn"
                  onClick={(e) => handleEdit(e, set.flashcardSetId)}
                  title="Sửa bộ flashcard"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Sửa
                </button>

                {/* Nút Xóa */}
                <button
                  type="button"
                  className="flashcard-library__delete-btn"
                  onClick={(e) => handleDelete(e, set.flashcardSetId)}
                  disabled={deletingId === set.flashcardSetId}
                  title="Xóa bộ flashcard"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                  {deletingId === set.flashcardSetId ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardLibrary;
