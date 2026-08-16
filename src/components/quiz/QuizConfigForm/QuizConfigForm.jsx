import React, { useState, useRef, useEffect } from "react";
import CustomInput from "../CustomInput/CustomInput";
import CustomSelect from "../CustomSelect/CustomSelect";
import QuestionCountSelector from "../QuestionCountSelector/QuestionCountSelector";
import QuestionTypeSelector from "../QuestionTypeSelector/QuestionTypeSelector";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import CustomTextarea from "../CustomTextarea/CustomTextarea";
import "./QuizConfigForm.css";

/**
 * BloomLevelDropdown - Custom dropdown for choosing Bloom's Taxonomy level.
 * Each option shows a title + short description (no icons).
 */
const BloomLevelDropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="bloom-select" ref={wrapRef}>
      <button
        type="button"
        className="bloom-select__trigger"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="bloom-select__trigger-text">
          {selected ? selected.label : "Chọn cấp độ"}
        </span>
        <svg
          className={`bloom-select__chevron ${open ? "bloom-select__chevron--open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="bloom-select__panel">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`bloom-select__option ${value === opt.value ? "bloom-select__option--active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <span className="bloom-select__option-title">{opt.label}</span>
              <span className="bloom-select__option-desc">{opt.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * QuizConfigForm - Left column configuration form
 */
const QuizConfigForm = ({
  formData,
  subjectOptions,
  difficultyOptions,
  questionCountPresets,
  questionTypes,
  onFieldChange,
  onDifficultyChange,
  onCountChange,
  onCustomCountChange,
  onTypeToggle,
  onToggleChange,
  onInputSettingChange,
  onBack,
  onNext,
}) => {
  return (
    <div className="quiz-config-form">
      <div className="quiz-config-form__card">
        <h2 className="quiz-config-form__heading">Cấu hình bài Quiz</h2>

        {/* Row 1: Quiz name + Subject */}
        <div className="quiz-config-form__row quiz-config-form__row--2col">
          <CustomInput
            label="Tên bài Quiz"
            required
            name="title"
            placeholder="Cấu trúc dữ liệu và giải thuật"
            value={formData.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
          />
          <CustomSelect
            label="Môn học"
            required
            name="subject"
            options={subjectOptions}
            value={formData.subject}
            onChange={(e) => onFieldChange("subject", e.target.value)}
            placeholder="Chọn môn học"
          />
        </div>

        {/* Row 2: Bloom level */}
        <div className="quiz-config-form__row">
          <label className="quiz-config-form__label">
            Cấp độ (Thang Bloom) <span className="quiz-config-form__required">*</span>
          </label>
          <BloomLevelDropdown
            options={difficultyOptions}
            value={formData.difficulty}
            onChange={onDifficultyChange}
          />
        </div>

        {/* Question count */}
        <div className="quiz-config-form__row">
          <QuestionCountSelector
            label="Số lượng câu hỏi"
            presets={questionCountPresets}
            value={formData.questionCount}
            customValue={formData.customCount}
            onPresetChange={onCountChange}
            onCustomChange={onCustomCountChange}
          />
        </div>

        {/* Question types */}
        <div className="quiz-config-form__row">
          <QuestionTypeSelector
            label="Loại câu hỏi"
            types={questionTypes}
            activeTypes={formData.activeTypes}
            onToggle={onTypeToggle}
          />
        </div>

        {/* Settings row */}
        <div className="quiz-config-form__row quiz-config-form__settings-grid">
          <ToggleSwitch
            label="Thời gian làm bài"
            checked={formData.timeEnabled}
            onChange={(val) => onToggleChange("timeEnabled", val)}
            showInput
            inputValue={formData.timeValue}
            onInputChange={(val) => onInputSettingChange("timeValue", val)}
            inputUnit="phút"
          />

          <ToggleSwitch
            label="Điểm mỗi câu"
            checked={formData.pointsEnabled}
            onChange={(val) => onToggleChange("pointsEnabled", val)}
            showInput
            inputValue={formData.pointsValue}
            onInputChange={(val) => onInputSettingChange("pointsValue", val)}
            inputUnit="điểm"
          />

          <ToggleSwitch
            label="Xáo trộn câu hỏi"
            description="Trộn ngẫu nhiên thứ tự câu hỏi và đáp án"
            checked={formData.shuffle}
            onChange={(val) => onToggleChange("shuffle", val)}
          />

          <ToggleSwitch
            label="Hiển thị kết quả ngay"
            description="Hiển thị điểm số sau khi nộp bài"
            checked={formData.showResult}
            onChange={(val) => onToggleChange("showResult", val)}
          />
        </div>

        {/* Description */}
        <div className="quiz-config-form__row">
          <CustomTextarea
            label="Mô tả (không bắt buộc)"
            name="description"
            placeholder="Nhập mô tả ngắn về bài quiz này..."
            value={formData.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            maxHeight={160}
          />
        </div>
      </div>

      {/* Bottom actions */}
      <div className="quiz-config-form__bottom">
        <button type="button" className="quiz-config-form__btn quiz-config-form__btn--back" onClick={onBack}>
          ← Quay lại
        </button>
        <button type="button" className="quiz-config-form__btn quiz-config-form__btn--next" onClick={onNext}>
          Tiếp tục →
        </button>
      </div>
    </div>
  );
};

export default QuizConfigForm;