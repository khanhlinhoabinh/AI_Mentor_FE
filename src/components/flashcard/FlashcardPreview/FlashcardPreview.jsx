import React from "react";
import FlashcardCard from "../FlashcardCard/FlashcardCard";
import FlashcardControls from "../FlashcardControls/FlashcardControls";
import "./FlashcardPreview.css";

const FlashcardPreview = ({
  cards,
  currentIndex,
  isFlipped,
  onFlip,
  onPrev,
  onNext,
  onEdit,
  color,
}) => {
  const currentCard = cards[currentIndex];

  return (
    <div className="flashcard-preview">
      <div className="flashcard-preview__header">
        <h3 className="flashcard-preview__title">Xem trước Flashcard</h3>
        <div className="flashcard-preview__header-actions">
          {onEdit && currentCard && (
            <button
              type="button"
              className="flashcard-preview__btn-edit"
              onClick={onEdit}
              title="Sửa thẻ này"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Sửa thẻ
            </button>
          )}
          <span className="flashcard-preview__counter">
            {cards.length > 0 ? currentIndex + 1 : 0} / {cards.length}
          </span>
        </div>
      </div>

      <div className="flashcard-preview__card-wrapper">
        {currentCard && (
          <FlashcardCard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={onFlip}
            color={color}
          />
        )}
      </div>

      <FlashcardControls
        currentIndex={currentIndex}
        total={cards.length}
        onPrev={onPrev}
        onNext={onNext}
        color={color}
      />
    </div>
  );
};

export default FlashcardPreview;