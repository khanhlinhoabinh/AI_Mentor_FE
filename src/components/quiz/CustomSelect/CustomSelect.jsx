import React from "react";
import { FiChevronDown } from "react-icons/fi";
import "./CustomSelect.css";

/**
 * CustomSelect - Reusable dropdown select
 */
const CustomSelect = ({ label, required, options, value, onChange, name, placeholder }) => {
  return (
    <div className="custom-select">
      {label && (
        <label className="custom-select__label">
          {label}
          {required && <span className="custom-select__required">*</span>}
        </label>
      )}
      <div className="custom-select__wrapper">
        <select
          className="custom-select__field"
          name={name}
          value={value}
          onChange={onChange}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="custom-select__arrow" />
      </div>
    </div>
  );
};

export default CustomSelect;