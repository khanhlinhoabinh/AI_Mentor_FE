import React, { useState, useEffect, useCallback } from "react";
import FlashcardCard from "../FlashcardCard/FlashcardCard";
import FlashcardControls from "../FlashcardControls/FlashcardControls";
import { getFlashcardSetFull } from "../../../services/flashcard.services";
import "./StudyModal.css";

const DEFAULT_COLOR = "#8B5CF6";

const StudyModal = ({ setId, onClose }) => {
  const [cards, setCards] = useState([]);
  const [setName, setSetName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!setId) return;
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

  const handleFlip = useCallback(() => setIsFlipped((f) => !f), []);
  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
    setIsFlipped(false);
  }, []);
  const handleNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(cards.length - 1, i + 1));
    setIsFlipped(false);
  }, [cards.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === " ") { e.preventDefault(); handleFlip(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handlePrev, handleNext, handleFlip]);

  const currentCard = cards[currentIndex];

  return (
    <div className="study-modal__overlay" onClick={onClose}>
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
          <button type="button" className="study-modal__close" onClick={onClose} title="Đóng (Esc)">
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