import React from "react";
import { FiX } from "react-icons/fi";
import "./UploadFileCard.css";

/**
 * UploadFileCard - Displays an uploaded file with metadata and remove button
 */
const UploadFileCard = ({ file, onRemove }) => {
  // Determine file type icon/color based on extension
  const getTypeInfo = (ext) => {
    const map = {
      pdf: { label: "PDF", color: "#ef4444", bg: "#fef2f2" },
      docx: { label: "DOC", color: "#3b82f6", bg: "#eff6ff" },
      doc: { label: "DOC", color: "#3b82f6", bg: "#eff6ff" },
      txt: { label: "TXT", color: "#6b7280", bg: "#f3f4f6" },
      pptx: { label: "PPT", color: "#f59e0b", bg: "#fffbeb" },
    };
    return map[ext?.toLowerCase()] || { label: "FILE", color: "#6b7280", bg: "#f3f4f6" };
  };

  const typeInfo = getTypeInfo(file.extension);

  return (
    <div className="upload-file-card">
      <div className="upload-file-card__type-badge" style={{ background: typeInfo.bg, color: typeInfo.color }}>
        {typeInfo.label}
      </div>

      <div className="upload-file-card__info">
        <span className="upload-file-card__name">{file.name}</span>
        <div className="upload-file-card__meta">
          {file.size && <span>{file.size}</span>}
          {file.pages && <span>• {file.pages} trang</span>}
        </div>
      </div>

      <button
        type="button"
        className="upload-file-card__remove"
        onClick={() => onRemove(file.id)}
        title="Xóa tài liệu"
      >
        <FiX />
      </button>
    </div>
  );
};

export default UploadFileCard;