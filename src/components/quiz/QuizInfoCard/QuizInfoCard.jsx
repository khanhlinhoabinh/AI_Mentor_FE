import React from "react";
import "./QuizInfoCard.css";

/**
 * QuizInfoCard - Info card with light blue background at bottom of right column
 */
const QuizInfoCard = ({ title, content }) => {
  return (
    <div className="quiz-info-card">
      <h4 className="quiz-info-card__title">{title}</h4>
      <p className="quiz-info-card__content">{content}</p>
    </div>
  );
};

export default QuizInfoCard;