import React from "react";
import { FiTarget, FiHelpCircle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import "./QuizHeader.css";

/**
 * QuizHeader - Top section of the quiz creation page
 * Shows title/description on left, action buttons on right
 */
const QuizHeader = ({ title, subtitle, onGuide, onAISuggest }) => {
  return (
    <div className="quiz-header">
      <div className="quiz-header__left">
        <div className="quiz-header__icon">
          <FiTarget />
        </div>
        <div className="quiz-header__text">
          <h1 className="quiz-header__title">{title}</h1>
          <p className="quiz-header__subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="quiz-header__actions">
        <button className="quiz-header__btn quiz-header__btn--outline" onClick={onGuide}>
          <FiHelpCircle className="quiz-header__btn-icon" />
          Hướng dẫn
        </button>
        <button className="quiz-header__btn quiz-header__btn--purple" onClick={onAISuggest}>
          <HiSparkles className="quiz-header__btn-icon" />
          AI gợi ý cấu hình
        </button>
      </div>
    </div>
  );
};

export default QuizHeader;