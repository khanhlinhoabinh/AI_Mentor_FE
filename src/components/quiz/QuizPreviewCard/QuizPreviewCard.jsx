import React from "react";
import { FiClipboard } from "react-icons/fi";
import "./QuizPreviewCard.css";

/**
 * QuizPreviewCard - Right column preview showing current config summary
 */
const QuizPreviewCard = ({ previewFields }) => {
  return (
    <div className="quiz-preview">
      <div className="quiz-preview__header">
        <h3 className="quiz-preview__title">Xem trước cấu hình</h3>
        <div className="quiz-preview__icon-wrap">
          <FiClipboard />
        </div>
      </div>

      <div className="quiz-preview__fields">
        {previewFields.map((field) => (
          <div key={field.key} className="quiz-preview__row">
            <span className="quiz-preview__field-label">{field.label}:</span>
            <span className="quiz-preview__field-value">{field.value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizPreviewCard;