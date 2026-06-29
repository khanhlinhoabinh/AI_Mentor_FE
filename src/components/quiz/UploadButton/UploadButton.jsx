import React, { useRef } from "react";
import { FiPlus } from "react-icons/fi";
import "./UploadButton.css";

/**
 * UploadButton - File upload trigger button with accepted formats hint
 */
const UploadButton = ({ label, hint, acceptedTypes, onFilesSelected }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = ""; // reset so same file can be re-added
    }
  };

  return (
    <div className="upload-button">
      <button
        type="button"
        className="upload-button__btn"
        onClick={() => inputRef.current?.click()}
      >
        <FiPlus className="upload-button__icon" />
        {label}
      </button>
      {hint && <p className="upload-button__hint">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        className="upload-button__input"
        onChange={handleChange}
      />
    </div>
  );
};

export default UploadButton;