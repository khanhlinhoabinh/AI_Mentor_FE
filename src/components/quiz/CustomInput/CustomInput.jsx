import React from "react";
import "./CustomInput.css";

/**
 * CustomInput - Reusable text input
 */
const CustomInput = ({ label, required, placeholder, value, onChange, name, type = "text" }) => {
  return (
    <div className="custom-input">
      {label && (
        <label className="custom-input__label">
          {label}
          {required && <span className="custom-input__required">*</span>}
        </label>
      )}
      <input
        className="custom-input__field"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomInput;