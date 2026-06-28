import React, { useRef, useEffect } from "react";
import "./CustomTextarea.css";

/**
 * CustomTextarea - Auto-resize textarea with max-height and scroll
 */
const CustomTextarea = ({ label, required, placeholder, value, onChange, name, maxHeight = 160 }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  }, [value, maxHeight]);

  return (
    <div className="custom-textarea">
      {label && (
        <label className="custom-textarea__label">
          {label}
          {required && <span className="custom-textarea__required">*</span>}
        </label>
      )}
      <textarea
        ref={textareaRef}
        className="custom-textarea__field"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ maxHeight: `${maxHeight}px` }}
        rows={3}
      />
    </div>
  );
};

export default CustomTextarea;