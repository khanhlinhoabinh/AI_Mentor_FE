import React from "react";
import { FiFileText, FiEdit3, FiType, FiSliders } from "react-icons/fi";
import UploadFileCard from "../UploadFileCard/UploadFileCard";
import UploadButton from "../UploadButton/UploadButton";
import "./SourceUpload.css";

/**
 * SourceUpload - Right column source card with tabs
 */
const SourceUpload = ({
  tabs,
  activeTab,
  onTabChange,
  uploadedFiles,
  onFileRemove,
  onFilesSelected,
  uploadHint,
  tipText,
}) => {
  const tabIcons = {
    document: <FiFileText />,
    note: <FiEdit3 />,
    text: <FiType />,
    custom: <FiSliders />,
  };

  return (
    <div className="source-upload">
      <h3 className="source-upload__title">Nguồn tạo câu hỏi</h3>

      {/* Tab bar */}
      <div className="source-upload__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`source-upload__tab ${activeTab === tab.value ? "source-upload__tab--active" : ""}`}
            onClick={() => onTabChange(tab.value)}
          >
            <span className="source-upload__tab-icon">{tabIcons[tab.icon] || <FiFileText />}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* File list */}
      <div className="source-upload__files">
        {uploadedFiles.map((file) => (
          <UploadFileCard key={file.id} file={file} onRemove={onFileRemove} />
        ))}
      </div>

      {/* Add more button */}
      <UploadButton
        label="Thêm tài liệu khác"
        hint={uploadHint}
        acceptedTypes=".pdf,.docx,.doc,.txt"
        onFilesSelected={onFilesSelected}
      />

      {/* Tip / hint box */}
      {tipText && (
        <div className="source-upload__tip">
          <span className="source-upload__tip-icon">💡</span>
          <div>
            <span className="source-upload__tip-title">Mẹo</span>
            <p className="source-upload__tip-body">{tipText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceUpload;