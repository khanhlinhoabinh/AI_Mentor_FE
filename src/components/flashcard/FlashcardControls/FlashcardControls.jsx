import React from "react";
import "./FlashcardControls.css";

const FlashcardControls = ({
  currentIndex,
  total,
  onPrev,
  onNext,
  color,
}) => {
  return (
    <div className="flashcard-controls">
      <button
        type="button"
        className="flashcard-controls__nav-btn"
        onClick={onPrev}
        disabled={currentIndex === 0}
        title="Thẻ trước"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="flashcard-controls__dots">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="flashcard-controls__dot"
            style={{ background: i === currentIndex ? color : "#d1d5db" }}
          />
        ))}
      </div>

      <button
        type="button"
        className="flashcard-controls__nav-btn"
        onClick={onNext}
        disabled={currentIndex === total - 1}
        title="Thẻ tiếp theo"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default FlashcardControls;