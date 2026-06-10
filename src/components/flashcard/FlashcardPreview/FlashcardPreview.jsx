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
  color,
}) => {
  const currentCard = cards[currentIndex];

  return (
    <div className="flashcard-preview">
      <div className="flashcard-preview__header">
        <h3 className="flashcard-preview__title">Xem trước Flashcard</h3>
        <span className="flashcard-preview__counter">
          {currentIndex + 1} / {cards.length}
        </span>
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