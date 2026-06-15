import React, { useCallback } from "react";
import "./EditFlashcardForm.css";

const QUESTION_MAX = 300;
const ANSWER_MAX = 500;

const TabIcon = ({ type }) => {
  if (type === "edit")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    );
  if (type === "ai")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
};

const ToolbarButton = ({ title, children, onClick }) => (
  <button type="button" className="edit-form__toolbar-btn" title={title} onClick={onClick}>
    {children}
  </button>
);

const EditFlashcardForm = ({
  formData,
  onFormChange,
  tabs,
  activeTab,
  onTabChange,
  categories,
  difficultyLevels,
  flashcardColors,
  onAddTag,
  onRemoveTag,
  onSave,
  onClearAll,
  totalCards,
  newTagInput,
  onNewTagInputChange,
}) => {
  const handleQuestionChange = useCallback(
    (e) => onFormChange("question", e.target.value.slice(0, QUESTION_MAX)),
    [onFormChange]
  );

  const handleAnswerChange = useCallback(
    (e) => onFormChange("answer", e.target.value.slice(0, ANSWER_MAX)),
    [onFormChange]
  );

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && newTagInput.trim()) {
      e.preventDefault();
      onAddTag(newTagInput.trim());
    }
  };

  const applyFormat = (format) => {
    const textarea = document.getElementById("answer-textarea");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formData.answer.substring(start, end);
    let wrapped = selected;
    if (format === "bold") wrapped = `**${selected}**`;
    if (format === "italic") wrapped = `_${selected}_`;
    if (format === "underline") wrapped = `__${selected}__`;
    if (format === "bullet") wrapped = `\n• ${selected}`;
    if (format === "number") wrapped = `\n1. ${selected}`;
    if (format === "link") wrapped = `[${selected}](url)`;
    const newVal =
      formData.answer.substring(0, start) +
      wrapped +
      formData.answer.substring(end);
    onFormChange("answer", newVal.slice(0, ANSWER_MAX));
  };

  return (
    <div className="edit-form">
      {/* Tabs */}
      <div className="edit-form__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`edit-form__tab ${activeTab === tab.id ? "edit-form__tab--active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <TabIcon type={tab.icon} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="edit-form__field">
        <div className="edit-form__field-header">
          <label className="edit-form__label">
            Câu hỏi (Mặt trước)
            <span className="edit-form__label-icon" title="Nội dung hiển thị ở mặt trước thẻ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
            </span>
          </label>
          <span className="edit-form__counter">
            {formData.question.length}/{QUESTION_MAX}
          </span>
        </div>
        <textarea
          className="edit-form__textarea"
          value={formData.question}
          onChange={handleQuestionChange}
          placeholder="Nhập câu hỏi..."
          rows={3}
        />
      </div>

      {/* Answer */}
      <div className="edit-form__field">
        <div className="edit-form__field-header">
          <label className="edit-form__label">
            Câu trả lời (Mặt sau)
            <span className="edit-form__label-icon" title="Nội dung hiển thị ở mặt sau thẻ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
            </span>
          </label>
          <span className="edit-form__counter">
            {formData.answer.length}/{ANSWER_MAX}
          </span>
        </div>
        <div className="edit-form__toolbar">
          <ToolbarButton title="Bold" onClick={() => applyFormat("bold")}><b>B</b></ToolbarButton>
          <ToolbarButton title="Italic" onClick={() => applyFormat("italic")}><i>I</i></ToolbarButton>
          <ToolbarButton title="Underline" onClick={() => applyFormat("underline")}><u>U</u></ToolbarButton>
          <div className="edit-form__toolbar-divider" />
          <ToolbarButton title="Danh sách gạch đầu dòng" onClick={() => applyFormat("bullet")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </ToolbarButton>
          <ToolbarButton title="Danh sách đánh số" onClick={() => applyFormat("number")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
              <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
            </svg>
          </ToolbarButton>
          <ToolbarButton title="Chèn liên kết" onClick={() => applyFormat("link")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </ToolbarButton>
        </div>
        <textarea
          id="answer-textarea"
          className="edit-form__textarea edit-form__textarea--answer"
          value={formData.answer}
          onChange={handleAnswerChange}
          placeholder="Nhập câu trả lời..."
          rows={4}
        />
      </div>

      {/* Category + Difficulty */}
      <div className="edit-form__row">
        <div className="edit-form__field">
          <label className="edit-form__label">
            Danh mục
            <span className="edit-form__label-icon" title="Phân loại chủ đề thẻ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
            </span>
          </label>
          <div className="edit-form__select-wrapper">
            <span
              className="edit-form__select-dot"
              style={{ background: formData.color }}
            />
            <select
              className="edit-form__select"
              value={formData.category}
              onChange={(e) => onFormChange("category", e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="edit-form__field">
          <label className="edit-form__label">
            Độ khó
            <span className="edit-form__label-icon" title="Mức độ khó của thẻ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
            </span>
          </label>
          <div className="edit-form__select-wrapper edit-form__select-wrapper--difficulty">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="edit-form__difficulty-icon">
              <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <select
              className="edit-form__select"
              value={formData.difficulty}
              onChange={(e) => onFormChange("difficulty", e.target.value)}
            >
              {difficultyLevels.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tags + Colors */}
      <div className="edit-form__row">
        <div className="edit-form__field">
          <label className="edit-form__label">
            Thẻ
            <span className="edit-form__label-icon" title="Từ khóa gắn với thẻ này">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
            </span>
          </label>
          <div className="edit-form__tags-wrapper">
            {formData.tags.map((tag) => (
              <span key={tag} className="edit-form__tag">
                {tag}
                <button
                  type="button"
                  className="edit-form__tag-remove"
                  onClick={() => onRemoveTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              className="edit-form__tag-input"
              value={newTagInput}
              onChange={(e) => onNewTagInputChange(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Thêm thẻ..."
            />
          </div>
        </div>

        <div className="edit-form__field">
          <label className="edit-form__label">
            Màu sắc thẻ
            <span className="edit-form__label-icon" title="Màu nền của flashcard">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
            </span>
          </label>
          <div className="edit-form__colors">
            {flashcardColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`edit-form__color-btn ${formData.color === color ? "edit-form__color-btn--active" : ""}`}
                style={{ background: color }}
                onClick={() => onFormChange("color", color)}
                title={color}
              >
                {formData.color === color && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Tag + Save/Clear */}
      <div className="edit-form__actions">
        <div className="edit-form__actions-left">
          <button
            type="button"
            className="edit-form__btn-add-tag"
            onClick={() => {
              if (newTagInput.trim()) onAddTag(newTagInput.trim());
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Thêm thẻ mới
          </button>
        </div>
        <div className="edit-form__actions-right">
          <button type="button" className="edit-form__btn-save" onClick={onSave}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Lưu thẻ
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="edit-form__footer">
        <span className="edit-form__total">Tổng số thẻ: {totalCards} thẻ</span>
        <button type="button" className="edit-form__btn-clear" onClick={onClearAll}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
          </svg>
          Xóa tất cả
        </button>
      </div>
    </div>
  );
};

export default EditFlashcardForm;