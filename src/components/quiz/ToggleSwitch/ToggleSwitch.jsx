import React from "react";
import "./ToggleSwitch.css";

/**
 * ToggleSwitch - Reusable toggle with label, description and optional input
 */
const ToggleSwitch = ({
  label,
  description,
  checked,
  onChange,
  inputValue,
  onInputChange,
  inputUnit,
  showInput,
}) => {
  return (
    <div className="toggle-switch">
      <div className="toggle-switch__top">
        <div className="toggle-switch__meta">
          <span className="toggle-switch__label">{label}</span>
          {description && (
            <span className="toggle-switch__desc">{description}</span>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          className={`toggle-switch__btn ${checked ? "toggle-switch__btn--on" : ""}`}
          onClick={() => onChange(!checked)}
        >
          <span className="toggle-switch__thumb" />
        </button>
      </div>

      {/* Inline input shown below when enabled */}
      {showInput && checked && (
        <div className="toggle-switch__input-row">
          <input
            className="toggle-switch__input"
            type="number"
            value={inputValue}
            min={0}
            onChange={(e) => onInputChange && onInputChange(e.target.value)}
          />
          {inputUnit && (
            <span className="toggle-switch__unit">{inputUnit}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ToggleSwitch;