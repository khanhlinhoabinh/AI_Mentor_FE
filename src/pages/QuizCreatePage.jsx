import React, { useState } from "react";
import QuizHeader from "../components/quiz/QuizHeader/QuizHeader";
import StepProgress from "../components/quiz/StepProgress/StepProgress";
import QuizConfigForm from "../components/quiz/QuizConfigForm/QuizConfigForm";
import SourceUpload from "../components/quiz/SourceUpload/SourceUpload";
import QuizPreviewCard from "../components/quiz/QuizPreviewCard/QuizPreviewCard";
import QuizInfoCard from "../components/quiz/QuizInfoCard/QuizInfoCard";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import "../styles/QuizCreatePage.css";

// ─── Static data (replace with API calls later) ───────────────────────────────

const pageHeaderData = {
  title: "Tạo Quiz mới",
  subtitle: "Tạo bài kiểm tra tùy chỉnh từ tài liệu hoặc chủ đề bạn muốn",
};

const stepData = [
  { id: "source", label: "Chọn nguồn", sublabel: "Chọn nội dung" },
  { id: "config", label: "Cấu hình", sublabel: "Thiết lập quiz" },
  { id: "questions", label: "Tạo câu hỏi", sublabel: "AI tạo câu hỏi" },
  { id: "finish", label: "Hoàn tất", sublabel: "Lưu & sử dụng" },
];

const subjectOptions = [
  { value: "cs", label: "Khoa học máy tính" },
  { value: "math", label: "Toán học" },
  { value: "physics", label: "Vật lý" },
  { value: "chemistry", label: "Hóa học" },
  { value: "english", label: "Tiếng Anh" },
  { value: "literature", label: "Văn học" },
];

const topicOptions = [
  { value: "ch1", label: "Chương 1: Giới thiệu về cấu trúc dữ liệu" },
  { value: "ch2", label: "Chương 2: Mảng và danh sách liên kết" },
  { value: "ch3", label: "Chương 3: Stack và Queue" },
  { value: "ch4", label: "Chương 4: Cây nhị phân" },
  { value: "ch5", label: "Chương 5: Đồ thị" },
];

const difficultyOptions = [
  { value: "easy", label: "Dễ", icon: "😊", color: "green" },
  { value: "medium", label: "Trung bình", icon: "😐", color: "orange" },
  { value: "hard", label: "Khó", icon: "🔴", color: "red" },
];

const questionCountPresets = [
  { value: 5, label: "5 câu" },
  { value: 10, label: "10 câu" },
  { value: 15, label: "15 câu" },
  { value: 20, label: "20 câu" },
];

const questionTypes = [
  {
    value: "multiple_choice",
    label: "Trắc nghiệm",
    description: "Chọn 1 đáp án",
    icon: "☑️",
    disabled: false,
  },
  {
    value: "multi_select",
    label: "Nhiều lựa chọn",
    description: "Chọn nhiều đáp án",
    icon: "📋",
    disabled: false,
  },
  {
    value: "true_false",
    label: "Đúng / Sai",
    description: "Đúng hoặc Sai",
    icon: "✅",
    disabled: false,
  },
  {
    value: "fill_blank",
    label: "Điền khuyết",
    description: "Điền vào chỗ trống",
    icon: "✏️",
    disabled: false,
  },
  {
    value: "essay",
    label: "Tự luận",
    description: "Trả lời ngắn",
    icon: "📝",
    disabled: false,
  },
  {
    value: "matching",
    label: "Ghép đôi",
    description: "Nối cặp đôi",
    icon: "🔗",
    disabled: true,
    comingSoon: true,
  },
];

const sourceTabs = [
  { value: "document", label: "Từ tài liệu", icon: "document" },
  { value: "note", label: "Từ ghi chú", icon: "note" },
  { value: "text", label: "Nhập văn bản", icon: "text" },
  { value: "custom", label: "Tùy chỉnh", icon: "custom" },
];

const uploadHint = "Hỗ trợ: PDF, DOCX, TXT (Tối đa 10MB mỗi file)";

const tipText =
  "AI sẽ phân tích nội dung tài liệu và tạo câu hỏi phù hợp với cấu hình bạn đã chọn.";

const infoCardData = {
  title: "Thông tin",
  content:
    "Sau khi hoàn tất, AI sẽ tạo 10 câu hỏi trắc nghiệm dựa trên tài liệu đã chọn.",
};

// ─── Default form state (replace field values with API defaults later) ─────────

const defaultFormData = {
  title: "Cấu trúc dữ liệu và giải thuật",
  subject: "cs",
  topic: "ch1",
  difficulty: "medium",
  questionCount: 10,
  customCount: 10,
  activeTypes: ["multiple_choice"],
  timeEnabled: true,
  timeValue: 30,
  pointsEnabled: true,
  pointsValue: 10,
  shuffle: true,
  showResult: false,
  description: "",
};

// Demo uploaded files (replace with API data later)
const defaultUploadedFiles = [
  {
    id: "f1",
    name: "Cấu trúc dữ liệu và giải thuật.pdf",
    extension: "pdf",
    size: "2.4 MB",
    pages: "24 trang",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getDifficultyLabel = (val, options) => {
  const found = options.find((o) => o.value === val);
  return found ? found.label : "—";
};

const getTypeLabels = (activeTypes, types) => {
  return types
    .filter((t) => activeTypes.includes(t.value))
    .map((t) => t.label)
    .join(", ");
};

const getSubjectLabel = (val, options) => {
  const found = options.find((o) => o.value === val);
  return found ? found.label : "—";
};

const getTopicLabel = (val, options) => {
  const found = options.find((o) => o.value === val);
  return found ? found.label : "—";
};

// ─── Page Component ────────────────────────────────────────────────────────────

const QuizCreatePage = () => {
  const [currentStep] = useState(2); // Step 2 = Cấu hình
  const [formData, setFormData] = useState(defaultFormData);
  const [uploadedFiles, setUploadedFiles] = useState(defaultUploadedFiles);
  const [activeSourceTab, setActiveSourceTab] = useState("document");

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDifficultyChange = (value) => {
    setFormData((prev) => ({ ...prev, difficulty: value }));
  };

  const handleCountChange = (value) => {
    setFormData((prev) => ({ ...prev, questionCount: value }));
  };

  const handleCustomCountChange = (value) => {
    setFormData((prev) => ({ ...prev, customCount: value }));
  };

  const handleTypeToggle = (typeValue) => {
    setFormData((prev) => {
      const has = prev.activeTypes.includes(typeValue);
      return {
        ...prev,
        activeTypes: has
          ? prev.activeTypes.filter((t) => t !== typeValue)
          : [...prev.activeTypes, typeValue],
      };
    });
  };

  const handleToggleChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleInputSettingChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleFileRemove = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleFilesSelected = (files) => {
    const newFiles = files.map((f, i) => ({
      id: `f${Date.now()}_${i}`,
      name: f.name,
      extension: f.name.split(".").pop(),
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      pages: null,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleBack = () => {
    // Placeholder: navigate to step 1
    console.log("Go back to step 1");
  };

  const handleNext = () => {
    // Placeholder: submit config and advance to step 3
    console.log("Advance to step 3", formData);
  };

  // ── Derived preview data ───────────────────────────────────────────────────

  const totalScore =
    formData.pointsEnabled
      ? (Number(formData.questionCount) || Number(formData.customCount) || 0) *
        Number(formData.pointsValue)
      : 0;

  const previewFields = [
    { key: "title", label: "Tên quiz", value: formData.title },
    { key: "subject", label: "Môn học", value: getSubjectLabel(formData.subject, subjectOptions) },
    { key: "topic", label: "Chủ đề", value: getTopicLabel(formData.topic, topicOptions) },
    { key: "difficulty", label: "Cấp độ", value: getDifficultyLabel(formData.difficulty, difficultyOptions) },
    {
      key: "count",
      label: "Số câu hỏi",
      value:
        formData.questionCount === "custom"
          ? `${formData.customCount} câu`
          : `${formData.questionCount} câu`,
    },
    { key: "types", label: "Loại câu", value: getTypeLabels(formData.activeTypes, questionTypes) },
    {
      key: "time",
      label: "Thời gian",
      value: formData.timeEnabled ? `${formData.timeValue} phút` : "Không giới hạn",
    },
    {
      key: "score",
      label: "Tổng điểm",
      value: formData.pointsEnabled ? `${totalScore} điểm` : "—",
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────

  return (
      <div className="quiz-page-content">
        <Header />

         <div className="quiz-page">
      <Sidebar />

        <main className="quiz-page-main">
          {/* Page header */}
          <QuizHeader
            title={pageHeaderData.title}
            subtitle={pageHeaderData.subtitle}
            onGuide={() => console.log("Open guide")}
            onAISuggest={() => console.log("AI suggest")}
          />

          {/* Step progress */}
          <StepProgress steps={stepData} currentStep={currentStep} />

          {/* Body */}
          <div className="quiz-page-body">
            {/* Left column */}
            <div className="quiz-page-left">
              <QuizConfigForm
                formData={formData}
                subjectOptions={subjectOptions}
                topicOptions={topicOptions}
                difficultyOptions={difficultyOptions}
                questionCountPresets={questionCountPresets}
                questionTypes={questionTypes}
                onFieldChange={handleFieldChange}
                onDifficultyChange={handleDifficultyChange}
                onCountChange={handleCountChange}
                onCustomCountChange={handleCustomCountChange}
                onTypeToggle={handleTypeToggle}
                onToggleChange={handleToggleChange}
                onInputSettingChange={handleInputSettingChange}
                onBack={handleBack}
                onNext={handleNext}
              />
            </div>

            {/* Right column */}
            <div className="quiz-page-right">
              <SourceUpload
                tabs={sourceTabs}
                activeTab={activeSourceTab}
                onTabChange={setActiveSourceTab}
                uploadedFiles={uploadedFiles}
                onFileRemove={handleFileRemove}
                onFilesSelected={handleFilesSelected}
                uploadHint={uploadHint}
                tipText={tipText}
              />

              <QuizPreviewCard previewFields={previewFields} />

              <QuizInfoCard title={infoCardData.title} content={infoCardData.content} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizCreatePage;