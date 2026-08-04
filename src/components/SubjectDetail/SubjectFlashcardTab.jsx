import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Plus, Sparkles, PenLine, PlayCircle } from "lucide-react";
import { getFlashcardSets } from "../../services/flashcard.services";
import StudyModal from "../flashcard/StudyModal/StudyModal";
import "./SubjectFlashcardTab.css";

export default function SubjectFlashcardTab({ subjectId }) {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studySetId, setStudySetId] = useState(null);

  const loadSets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFlashcardSets();
      const all = res.data || [];
      // Chỉ giữ các bộ flashcard có liên kết với môn học hiện tại
      const linked = all.filter(
        (s) => String(s.subjectId) === String(subjectId)
      );
      setSets(linked);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách flashcard."
      );
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    loadSets();
  }, [loadSets]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getSourceMeta = (sourceType) =>
    sourceType === "AI"
      ? { label: "AI tạo", icon: Sparkles, className: "sft-badge--ai" }
      : { label: "Thủ công", icon: PenLine, className: "sft-badge--manual" };

  return (
    <div className="sft-wrap">
      <div className="sft-header">
        <div className="sft-header-left">
          <div className="sft-header-icon">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="sft-title">Flashcard của môn học</h3>
            <p className="sft-subtitle">
              {loading
                ? "Đang tải..."
                : `${sets.length} bộ flashcard được liên kết`}
            </p>
          </div>
        </div>
        <button
          className="sft-create-btn"
          onClick={() => navigate("/flashcards/new")}
        >
          <Plus size={15} /> Tạo Flashcard
        </button>
      </div>

      {error && <div className="sft-error">{error}</div>}

      {loading && (
        <div className="sft-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="sft-card sft-skeleton" />
          ))}
        </div>
      )}

      {!loading && !error && sets.length === 0 && (
        <div className="sft-empty">
          <div className="sft-empty-icon">🗂️</div>
          <p className="sft-empty-title">
            Chưa có bộ flashcard nào liên kết với môn học này
          </p>
          <p className="sft-empty-sub">
            Tạo bộ flashcard đầu tiên để bắt đầu ôn tập nhanh hơn
          </p>
          <button
            className="sft-create-btn"
            onClick={() => navigate("/flashcards/new")}
          >
            <Plus size={15} /> Tạo bộ Flashcard
          </button>
        </div>
      )}

      {!loading && !error && sets.length > 0 && (
        <div className="sft-grid">
          {sets.map((set) => {
            const meta = getSourceMeta(set.sourceType);
            const SourceIcon = meta.icon;
            return (
              <div key={set.flashcardSetId} className="sft-card">
                <div className="sft-card-top">
                  <div className="sft-card-icon">
                    <Layers size={20} />
                  </div>
                  <span className={`sft-badge ${meta.className}`}>
                    <SourceIcon size={11} /> {meta.label}
                  </span>
                </div>

                <h4 className="sft-card-name">{set.setName}</h4>
                {set.description && (
                  <p className="sft-card-desc">{set.description}</p>
                )}

                <div className="sft-card-meta">
                  <span>{set.totalCards ?? 0} thẻ</span>
                  <span className="sft-dot">•</span>
                  <span>{formatDate(set.createdAt)}</span>
                </div>

                <div className="sft-card-actions">
                  <button
                    className="sft-btn sft-btn-primary"
                    onClick={() => setStudySetId(set.flashcardSetId)}
                    disabled={!set.totalCards}
                    title={!set.totalCards ? "Bộ này chưa có thẻ nào" : ""}
                  >
                    <PlayCircle size={14} /> Học thử
                  </button>
                  <button
                    className="sft-btn sft-btn-outline"
                    onClick={() =>
                      navigate(`/flashcard-sets/${set.flashcardSetId}/edit`)
                    }
                  >
                    <PenLine size={14} /> Sửa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {studySetId && (
        <StudyModal setId={studySetId} onClose={() => setStudySetId(null)} />
      )}
    </div>
  );
}