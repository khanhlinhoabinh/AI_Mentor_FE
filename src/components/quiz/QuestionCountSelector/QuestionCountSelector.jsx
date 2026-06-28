import React from "react";
import "./QuestionCountSelector.css";

/**
 * QuestionCountSelector - Choose number of questions (preset or custom)
 */
const QuestionCountSelector = ({ label, presets, value, customValue, onPresetChange, onCustomChange }) => {
  const isCustom = !presets.find((p) => p.value === value);

  return (
    <div className="question-count">
      {label && <label className="question-count__label">{label}</label>}
      <div className="question-count__options">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            className={`question-count__btn ${value === preset.value ? "question-count__btn--active" : ""}`}
            onClick={() => onPresetChange(preset.value)}
          >
            {preset.label}
          </button>
        ))}

        {/* Custom option */}
        <button
          type="button"
          className={`question-count__btn ${isCustom ? "question-count__btn--active" : ""}`}
          onClick={() => onPresetChange("custom")}
        >
          Tùy chỉnh
        </button>

        {/* Custom input inline */}
        {isCustom && (
          <div className="question-count__custom">
            <input
              className="question-count__custom-input"
              type="number"
              min={1}
              max={100}
              value={customValue}
              onChange={(e) => onCustomChange(e.target.value)}
            />
            <span className="question-count__unit">câu</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCountSelector;