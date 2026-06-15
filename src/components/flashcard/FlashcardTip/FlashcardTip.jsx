import React from "react";
import "./FlashcardTip.css";

const FlashcardTip = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="flashcard-tip">
      <div className="flashcard-tip__header">
        <span className="flashcard-tip__icon">💡</span>
        <span className="flashcard-tip__title">Mẹo hay</span>
        <button
          type="button"
          className="flashcard-tip__close"
          onClick={onClose}
          title="Đóng"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <p className="flashcard-tip__text">
        Sử dụng câu hỏi ngắn gọn, rõ ràng và câu trả lời súc tích để giúp ghi nhớ hiệu quả hơn.
      </p>
    </div>
  );
};

export default FlashcardTip;