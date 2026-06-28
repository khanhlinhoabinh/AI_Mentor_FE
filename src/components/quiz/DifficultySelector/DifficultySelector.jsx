import React from "react";
import "./DifficultySelector.css";

/**
 * DifficultySelector - Pill-style difficulty selection
 */
const DifficultySelector = ({ label, options, value, onChange }) => {
  return (
    <div className="difficulty-selector">
      {label && <label className="difficulty-selector__label">{label}</label>}
      <div className="difficulty-selector__options">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`difficulty-selector__btn difficulty-selector__btn--${opt.color} ${value === opt.value ? "difficulty-selector__btn--active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            <span className="difficulty-selector__icon">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;