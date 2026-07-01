import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import StepProgress from "../components/flashcard/StepProgress/StepProgress";
import EditFlashcardForm from "../components/flashcard/EditFlashcardForm/EditFlashcardForm";
import FlashcardPreview from "../components/flashcard/FlashcardPreview/FlashcardPreview";
import FlashcardTip from "../components/flashcard/FlashcardTip/FlashcardTip";
import StudyModal from "../components/flashcard/StudyModal/StudyModal";
import FlashcardLibrary from "../components/flashcard/FlashcardLibrary/FlashcardLibrary";
import { STEPS, CURRENT_STEP } from "../components/flashcard/mock/flashcardData";
import {
  getFlashcardSetFull,
  updateFlashcardSourceType,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "../services/flashcard.services";
import "../styles/FlashcardEditPage.css";

const EMPTY_FORM = {
  cardType: "QA",
  frontContent: "",
  backContent: "",
};

const DEFAULT_CARD_COLOR = "#8B5CF6";

const FlashcardEditPage = () => {
  const { setId } = useParams();

  // ─── Set / cards state ──────────────────────────────────────────────────
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Form state ─────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [editingCardId, setEditingCardId] = useState(null);
  const [saving, setSaving] = useState(false);

  // ─── Preview state ──────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // ─── Tip ────────────────────────────────────────────────────────────────
  const [tipVisible, setTipVisible] = useState(true);

  // ─── View mode: "edit" | "library" ──────────────────────────────────────
  const [viewMode, setViewMode] = useState("edit");

  // ─── Study modal: setId của set đang học thử (null = đóng) ──────────────
  const [studySetId, setStudySetId] = useState(null);

  // ─── Load dữ liệu set + cards ───────────────────────────────────────────
  const loadSet = useCallback(async () => {
    if (!setId) {
      setError("Thiếu setId trên đường dẫn.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getFlashcardSetFull(setId);
      setFlashcardSet(res.data);
      setFlashcards(res.data.cards || []);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải dữ liệu flashcard set.");
    } finally {
      setLoading(false);
    }
  }, [setId]);

  useEffect(() => {
    loadSet();
  }, [loadSet]);

  // ─── Đảm bảo set có sourceType = MANUAL ─────────────────────────────────
  const ensureManualSource = useCallback(async () => {
    if (!flashcardSet) return;
    if (flashcardSet.sourceType !== "MANUAL") {
      const res = await updateFlashcardSourceType(setId, "MANUAL");
      setFlashcardSet((prev) => ({ ...prev, sourceType: res.data.sourceType }));
    }
  }, [flashcardSet, setId]);

  // ─── Form handlers ──────────────────────────────────────────────────────
  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...EMPTY_FORM });
    setEditingCardId(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!setId || saving) return;
    setSaving(true);
    setError(null);
    try {
      if (editingCardId) {
        await updateFlashcard(editingCardId, {
          cardType: formData.cardType,
          frontContent: formData.frontContent,
          backContent: formData.backContent,
        });
      } else {
        await ensureManualSource();
        await createFlashcard(setId, {
          cardType: formData.cardType,
          frontContent: formData.frontContent,
          backContent: formData.backContent,
        });
      }
      resetForm();
      await loadSet();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu flashcard.");
    } finally {
      setSaving(false);
    }
  }, [setId, saving, editingCardId, formData, ensureManualSource, resetForm, loadSet]);

  const handleDelete = useCallback(async () => {
    if (!editingCardId || saving) return;
    setSaving(true);
    setError(null);
    try {
      await deleteFlashcard(editingCardId);
      resetForm();
      await loadSet();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa flashcard.");
    } finally {
      setSaving(false);
    }
  }, [editingCardId, saving, resetForm, loadSet]);

  // ─── Preview handlers ───────────────────────────────────────────────────
  const handleFlip = useCallback(() => setIsFlipped((f) => !f), []);
  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
    setIsFlipped(false);
  }, []);
  const handleNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(flashcards.length - 1, i + 1));
    setIsFlipped(false);
  }, [flashcards.length]);

  const safeIndex = useMemo(
    () => Math.min(currentIndex, Math.max(0, flashcards.length - 1)),
    [currentIndex, flashcards.length]
  );

  const handleEditCurrentCard = useCallback(() => {
    const card = flashcards[safeIndex];
    if (!card) return;
    setFormData({
      cardType: card.cardType,
      frontContent: card.frontContent,
      backContent: card.backContent,
    });
    setEditingCardId(card.flashcardId);
  }, [flashcards, safeIndex]);

  return (
    <div className="flashcard-layout">
      <Header />
      <div className="flashcard-layout__body">
        <Sidebar />
        <main className="flashcard-layout__main">
          <div className="flashcard-page">

            {/* Page Header — luôn hiển thị */}
            <div className="flashcard-page__header">
              <div className="flashcard-page__header-left">
                <div className="flashcard-page__header-icon">✨</div>
                <div>
                  <h1 className="flashcard-page__title">Tạo Flashcard</h1>
                  <p className="flashcard-page__subtitle">
                    Biến tài liệu thành những thẻ ghi nhớ thông minh
                  </p>
                </div>
              </div>
              <div className="flashcard-page__header-right">
                <button type="button" className="flashcard-page__btn-guide">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Hướng dẫn
                </button>
                <button
                  type="button"
                  className="flashcard-page__btn-library"
                  onClick={() =>
                    setViewMode((v) => (v === "library" ? "edit" : "library"))
                  }
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  {viewMode === "library" ? "Quay lại chỉnh sửa" : "Thư viện Flashcard"}
                </button>
              </div>
            </div>

            {/* Step Progress — ẩn khi xem thư viện */}
            {viewMode === "edit" && (
              <div className="flashcard-page__steps">
                <StepProgress steps={STEPS} currentStep={CURRENT_STEP} />
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="flashcard-page__error" role="alert">
                {error}
              </div>
            )}

            {/* ─── VIEW: LIBRARY ─── */}
            {viewMode === "library" && (
              <div className="flashcard-page__content">
                <div style={{ width: "100%" }}>
                  <FlashcardLibrary
                    onBack={() => setViewMode("edit")}
                    onStudy={(targetSetId) => setStudySetId(targetSetId)}
                  />
                </div>
              </div>
            )}

            {/* ─── VIEW: EDIT ─── */}
            {viewMode === "edit" && (
              <div className="flashcard-page__content">

                {/* Left Column */}
                <div className="flashcard-page__left">
                  <div className="flashcard-page__card">
                    <h2 className="flashcard-page__section-title">
                      3.&nbsp; Chỉnh sửa Flashcard
                    </h2>
                    <EditFlashcardForm
                      formData={formData}
                      onChange={handleFormChange}
                      onSave={handleSave}
                      onDelete={handleDelete}
                      isEditing={Boolean(editingCardId)}
                      onCreateNew={resetForm}
                      onCreateNewSet={() => { window.location.href = "/flashcards/new"; }}
                      saving={saving}
                      totalCards={flashcards.length}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="flashcard-page__right">
                  {loading ? (
                    <div className="flashcard-page__empty-preview">
                      <span>Đang tải dữ liệu...</span>
                    </div>
                  ) : flashcards.length > 0 ? (
                    <FlashcardPreview
                      cards={flashcards}
                      currentIndex={safeIndex}
                      isFlipped={isFlipped}
                      onFlip={handleFlip}
                      onPrev={handlePrev}
                      onNext={handleNext}
                      onEdit={handleEditCurrentCard}
                      color={DEFAULT_CARD_COLOR}
                    />
                  ) : (
                    <div className="flashcard-page__empty-preview">
                      <span>Chưa có thẻ nào. Hãy lưu thẻ đầu tiên!</span>
                    </div>
                  )}

                  {/* Study Mode Button */}
                  <button
                    type="button"
                    className="flashcard-page__btn-study"
                    onClick={() => setStudySetId(setId)}
                    disabled={flashcards.length === 0}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Xem chế độ học thử
                  </button>

                  {/* Tip */}
                  <FlashcardTip
                    visible={tipVisible}
                    onClose={() => setTipVisible(false)}
                  />
                </div>

              </div>
            )}

          </div>
        </main>
      </div>

      {/* Study Modal — phủ toàn màn hình */}
      {studySetId && (
        <StudyModal
          setId={studySetId}
          onClose={() => setStudySetId(null)}
        />
      )}
    </div>
  );
};

export default FlashcardEditPage;