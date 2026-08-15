import React from "react";
import "./QuestionTypeSelector.css";

/**
 * QuestionTypeSelector - Grid of question type cards (no icons)
 * Supports multi-select via activeTypes array
 */
const QuestionTypeSelector = ({ label, types, activeTypes, onToggle }) => {
  return (
    <div className="question-type">
      {label && <label className="question-type__label">{label}</label>}
      <div className="question-type__grid">
        {types.map((type) => {
          const isActive = activeTypes.includes(type.value);
          return (
            <button
              key={type.value}
              type="button"
              className={`question-type__card ${isActive ? "question-type__card--active" : ""} ${type.disabled ? "question-type__card--disabled" : ""}`}
              onClick={() => !type.disabled && onToggle(type.value)}
              disabled={type.disabled}
              title={type.comingSoon ? "Sắp ra mắt" : ""}
            >
              <span className="question-type__name">{type.label}</span>
              <span className="question-type__desc">{type.description}</span>
              {type.comingSoon && (
                <span className="question-type__badge">Sắp ra mắt</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionTypeSelector;