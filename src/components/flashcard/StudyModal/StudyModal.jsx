import React, { useState, useEffect, useRef, useCallback } from "react";
import FlashcardCard from "../FlashcardCard/FlashcardCard";
import FlashcardControls from "../FlashcardControls/FlashcardControls";
import { getFlashcardSetFull } from "../../../services/flashcard.services";
import { recordFlashcardStudy } from "../../../services/learningActivity.services";

import "./StudyModal.css";

const DEFAULT_COLOR = "#8B5CF6";

const StudyModal = ({ setId, onClose }) => {
  const [cards, setCards] = useState([]);
  const [setName, setSetName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Theo dõi phiên học: thời điểm bắt đầu + tập hợp các thẻ đã xem qua (không đếm trùng)
  // Khởi tạo null lúc render — gán giá trị Date.now() thật bên trong useEffect (chạy sau render)
  const startTimeRef = useRef(null);
  const viewedIndicesRef = useRef(new Set());

  useEffect(() => {
    if (!setId) return;

    // Reset lại phiên học mỗi khi mở bộ flashcard mới
    startTimeRef.current = Date.now();
    viewedIndicesRef.current = new Set();

    const loadCards = async () => {
      setLoading(true);
      setError(null);
      setCurrentIndex(0);
      setIsFlipped(false);
      try {
        const res = await getFlashcardSetFull(setId);
        setCards(res.data.cards || []);
        setSetName(res.data.setName || "");
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải flashcard.");
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, [setId]);

  // Mỗi khi chuyển sang 1 thẻ, ghi nhận thẻ đó đã được xem
  useEffect(() => {
    if (cards.length > 0) {
      viewedIndicesRef.current.add(currentIndex);
    }
  }, [currentIndex, cards.length]);

  const handleFlip = useCallback(() => setIsFlipped((f) => !f), []);
  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
    setIsFlipped(false);
  }, []);
  const handleNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(cards.length - 1, i + 1));
    setIsFlipped(false);
  }, [cards.length]);

  // Đóng modal: ghi nhận phiên học (nếu có xem thẻ nào) rồi mới đóng
  const handleClose = useCallback(() => {
    const cardsReviewedCount = viewedIndicesRef.current.size;

    if (setId && cardsReviewedCount > 0) {
      const startedAt = startTimeRef.current ?? Date.now();
      const durationSeconds = Math.round((Date.now() - startedAt) / 1000);

      recordFlashcardStudy({
        flashcardSetId: setId,
        cardsReviewed: cardsReviewedCount,
        durationSeconds,
      }).catch((err) => {
        console.error("Không thể ghi nhận phiên học:", err);
      });
    }

    onClose();
  }, [onClose, setId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === " ") { e.preventDefault(); handleFlip(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, handlePrev, handleNext, handleFlip]);

  const currentCard = cards[currentIndex];

  return (
    <div className="study-modal__overlay" onClick={handleClose}>
      <div className="study-modal__container" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="study-modal__header">
          <div className="study-modal__header-left">
            <span className="study-modal__icon">📚</span>
            <div>
              <h2 className="study-modal__title">{setName || "Học thử"}</h2>
              {cards.length > 0 && (
                <p className="study-modal__subtitle">
                  {currentIndex + 1} / {cards.length} thẻ
                  &nbsp;·&nbsp;Space lật · ← → chuyển thẻ
                </p>
              )}
            </div>
          </div>
          <button type="button" className="study-modal__close" onClick={handleClose} title="Đóng (Esc)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="study-modal__content">
          {loading && <div className="study-modal__state"><span>Đang tải flashcard...</span></div>}
          {error && <div className="study-modal__state study-modal__state--error"><span>{error}</span></div>}
          {!loading && !error && cards.length === 0 && (
            <div className="study-modal__state"><span>Bộ flashcard này chưa có thẻ nào.</span></div>
          )}
          {!loading && !error && currentCard && (
            <>
              <div className="study-modal__card-wrapper">
                <FlashcardCard
                  card={currentCard}
                  isFlipped={isFlipped}
                  onFlip={handleFlip}
                  color={DEFAULT_COLOR}
                />
              </div>
              <FlashcardControls
                currentIndex={currentIndex}
                total={cards.length}
                onPrev={handlePrev}
                onNext={handleNext}
                color={DEFAULT_COLOR}
              />
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudyModal;