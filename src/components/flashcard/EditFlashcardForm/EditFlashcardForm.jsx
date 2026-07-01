import React, { useCallback } from "react";
import "./EditFlashcardForm.css";

const FRONT_MAX = 300;
const BACK_MAX = 500;

const CARD_TYPES = [
  { value: "QA", label: "Hỏi & Đáp (QA)" },
  { value: "VOCAB", label: "Từ vựng (VOCAB)" },
];

const EditFlashcardForm = ({
  formData,
  onChange,
  onSave,
  onDelete,
  isEditing,
  onCreateNew,
  onCreateNewSet,
  saving,
  totalCards,
}) => {
  const handleCardTypeChange = useCallback(
    (e) => onChange("cardType", e.target.value),
    [onChange]
  );

  const handleFrontChange = useCallback(
    (e) => onChange("frontContent", e.target.value.slice(0, FRONT_MAX)),
    [onChange]
  );

  const handleBackChange = useCallback(
    (e) => onChange("backContent", e.target.value.slice(0, BACK_MAX)),
    [onChange]
  );

  const canSave =
    !saving &&
    formData.frontContent.trim().length > 0 &&
    formData.backContent.trim().length > 0;

  return (
    <div className="edit-form">

      {/* Card Type */}
      <div className="edit-form__field">
        <div className="edit-form__field-header">
          <label className="edit-form__label">
            Loại thẻ
            <span className="edit-form__label-icon" title="Loại flashcard">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
            </span>
          </label>
        </div>
        <div className="edit-form__select-wrapper">
          <select
            className="edit-form__select"
            value={formData.cardType}
            onChange={handleCardTypeChange}
          >
            {CARD_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Front Content */}
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
            {formData.frontContent.length}/{FRONT_MAX}
          </span>
        </div>
        <textarea
          className="edit-form__textarea"
          value={formData.frontContent}
          onChange={handleFrontChange}
          placeholder="Nhập câu hỏi..."
          rows={3}
        />
      </div>

      {/* Back Content */}
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
            {formData.backContent.length}/{BACK_MAX}
          </span>
        </div>
        <textarea
          className="edit-form__textarea edit-form__textarea--answer"
          value={formData.backContent}
          onChange={handleBackChange}
          placeholder="Nhập câu trả lời..."
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="edit-form__actions">
        <div className="edit-form__actions-left">
          {isEditing && (
            <button
              type="button"
              className="edit-form__btn-add-tag"
              onClick={onCreateNew}
              disabled={saving}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tạo thẻ mới
            </button>
          )}
        </div>
        <div className="edit-form__actions-right">
          {isEditing && (
            <button
              type="button"
              className="edit-form__btn-clear"
              onClick={onDelete}
              disabled={saving}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
              Xóa thẻ
            </button>
          )}
          <button
            type="button"
            className="edit-form__btn-save"
            onClick={onSave}
            disabled={!canSave}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {isEditing ? "Cập nhật thẻ" : "Lưu thẻ"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="edit-form__footer">
        <span className="edit-form__total">Tổng số thẻ: {totalCards} thẻ</span>
        <button
          type="button"
          className="edit-form__btn-add-tag"
          onClick={onCreateNewSet}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tạo bộ thẻ mới
        </button>
      </div>

    </div>
  );
};

export default EditFlashcardForm;