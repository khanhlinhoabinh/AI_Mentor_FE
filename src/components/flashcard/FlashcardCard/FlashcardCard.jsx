import React from "react";
import "./FlashcardCard.css";

const FlashcardCard = ({ card, isFlipped, onFlip, color }) => {
  return (
    <div className="flashcard-card" onClick={onFlip}>
      <div className={`flashcard-card__inner ${isFlipped ? "flashcard-card__inner--flipped" : ""}`}>
        {/* Front */}
        <div className="flashcard-card__face flashcard-card__face--front" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
          <div className="flashcard-card__face-header">
            <span className="flashcard-card__face-label">Câu hỏi</span>
            <button
              type="button"
              className="flashcard-card__copy-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard?.writeText(card.question);
              }}
              title="Sao chép"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
          <div className="flashcard-card__face-content">
            <p className="flashcard-card__question">{card.question}</p>
          </div>
          <div className="flashcard-card__face-footer">
            <span className="flashcard-card__hint">Nhấn để xem đáp án</span>
          </div>
        </div>

        {/* Back */}
        <div className="flashcard-card__face flashcard-card__face--back" style={{ background: `linear-gradient(135deg, ${color}dd 0%, ${color} 100%)` }}>
          <div className="flashcard-card__face-header">
            <span className="flashcard-card__face-label">Câu trả lời</span>
            <button
              type="button"
              className="flashcard-card__copy-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard?.writeText(card.answer);
              }}
              title="Sao chép"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
          <div className="flashcard-card__face-content flashcard-card__face-content--answer">
            <p className="flashcard-card__answer">{card.answer}</p>
          </div>
          <div className="flashcard-card__face-footer">
            <span className="flashcard-card__hint">Nhấn để xem câu hỏi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCard;