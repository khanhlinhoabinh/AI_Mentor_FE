import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import QuizHeader from "../components/quiz/QuizHeader/QuizHeader";
import StepProgress from "../components/quiz/StepProgress/StepProgress";
import QuizConfigForm from "../components/quiz/QuizConfigForm/QuizConfigForm";
import QuizPreviewCard from "../components/quiz/QuizPreviewCard/QuizPreviewCard";
import QuizInfoCard from "../components/quiz/QuizInfoCard/QuizInfoCard";
import UploadButton from "../components/quiz/UploadButton/UploadButton";
import UploadFileCard from "../components/quiz/UploadFileCard/UploadFileCard";
import { getSubjects } from "../services/subject.services";
import {
  createQuizSet,
  generateFromText,
  generateFromFile,
  saveQuestions,
} from "../services/quiz.services";
import "../styles/QuizCreatePage.css";

/* ─── Constants ─────────────────────────────────── */
const STEPS = [
  { id: "source", label: "Chọn nguồn", sublabel: "Chọn nội dung" },
  { id: "config", label: "Cấu hình", sublabel: "Thiết lập quiz" },
  { id: "questions", label: "Tạo câu hỏi", sublabel: "AI tạo câu hỏi" },
  { id: "finish", label: "Hoàn tất", sublabel: "Lưu & sử dụng" },
];

// Cấp độ theo Thang Bloom
const DIFFICULTY_OPTIONS = [
  {
    value: "REMEMBERING",
    label: "Ghi nhớ (Remembering)",
    description: "Nhớ lại, nhận diện, liệt kê, định nghĩa, tái hiện thông tin đã học",
  },
  {
    value: "UNDERSTANDING",
    label: "Hiểu (Understanding)",
    description: "Diễn giải, giải thích, tóm tắt, so sánh, liên hệ, suy luận ý nghĩa thông tin",
  },
  {
    value: "APPLYING",
    label: "Áp dụng (Applying)",
    description: "Vận dụng kiến thức vào tình huống mới, thực hành, giải quyết vấn đề",
  },
  {
    value: "ANALYZING",
    label: "Phân tích (Analyzing)",
    description: "Chia nhỏ thông tin, xác định mối quan hệ, tìm nguyên nhân – kết quả, so sánh, đánh giá cấu trúc",
  },
  {
    value: "EVALUATING",
    label: "Đánh giá (Evaluating)",
    description: "Dùng tiêu chí, chuẩn mực để đưa ra phán quyết, phê bình, lựa chọn, đề xuất",
  },
  {
    value: "CREATING",
    label: "Sáng tạo (Creating)",
    description: "Tổ hợp, xây dựng, thiết kế, phát triển sản phẩm, giải pháp mới dựa trên kiến thức đã có",
  },
];

const COUNT_PRESETS = [
  { value: 5, label: "5 câu" },
  { value: 10, label: "10 câu" },
  { value: 15, label: "15 câu" },
  { value: 20, label: "20 câu" },
];

// Chỉ 2 loại BE hỗ trợ (không icon)
const QUESTION_TYPES = [
  {
    value: "MULTIPLE_CHOICE",
    label: "Trắc nghiệm",
    description: "Chọn 1 đáp án đúng",
    disabled: false,
  },
  {
    value: "TRUE_FALSE",
    label: "Đúng / Sai",
    description: "Đúng hoặc Sai",
    disabled: false,
  },
];

// Chỉ 2 nguồn BE hỗ trợ (không icon)
const SOURCE_TABS = [
  { value: "file", label: "Từ tài liệu" },
  { value: "text", label: "Nhập văn bản" },
];

const DEFAULT_FORM = {
  title: "",
  subjectId: "",
  difficulty: "UNDERSTANDING",
  questionCount: 10,
  customCount: 10,
  activeType: "MULTIPLE_CHOICE", // single — BE chỉ nhận 1 loại
  timeEnabled: true,
  timeValue: 30,
  pointsEnabled: true,
  pointsValue: 2,
  shuffle: true,
  showResult: true,
  description: "",
};

/* ─── Helpers ───────────────────────────────────── */
function parseAIJson(raw) {
  if (typeof raw !== "string") {
    return raw;
  }
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

/* ─── Page ──────────────────────────────────────── */
export default function QuizCreatePage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [subjects, setSubjects] = useState([]);
  const [sourceTab, setSourceTab] = useState("file");
  const [files, setFiles] = useState([]);
  const [fileCards, setFileCards] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [quizSetId, setQuizSetId] = useState(null);
  const [rawQuestions, setRawQuestions] = useState([]);
  const [editableQs, setEditableQs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getSubjects()
      .then((data) => setSubjects(data))
      .catch(() => {});
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const field = (key, val) => setFormData((p) => ({ ...p, [key]: val }));

  const subjectOptions = [
    { value: "", label: "Không liên kết môn học" },
    ...subjects.map((s) => ({
      value: String(s.subjectId),
      label: s.subjectName,
    })),
  ];

  const handleFilesSelected = (newFiles) => {
    const added = newFiles.map((f, i) => ({
      id: `f${Date.now()}_${i}`,
      name: f.name,
      extension: f.name.split(".").pop(),
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      pages: null,
      _file: f,
    }));
    setFiles((p) => [...p, ...newFiles]);
    setFileCards((p) => [...p, ...added]);
  };

  const handleFileRemove = (id) => {
    const idx = fileCards.findIndex((c) => c.id === id);
    setFileCards((p) => p.filter((c) => c.id !== id));
    if (idx >= 0) setFiles((p) => p.filter((_, i) => i !== idx));
  };

  const handleStep1Next = () => {
    if (sourceTab === "file" && files.length === 0) {
      showToast("Vui lòng upload ít nhất 1 file PDF", "error");
      return;
    }
    if (sourceTab === "text" && !textInput.trim()) {
      showToast("Vui lòng nhập nội dung văn bản", "error");
      return;
    }
    setStep(2);
  };

  const handleStep2Next = async () => {
    if (!formData.title.trim()) {
      showToast("Vui lòng nhập tên bài Quiz", "error");
      return;
    }

    const count =
      formData.questionCount === "custom"
        ? Number(formData.customCount)
        : Number(formData.questionCount);

    setLoading(true);
    try {
      const newSet = await createQuizSet({
        title: formData.title,
        subjectId: formData.subjectId ? Number(formData.subjectId) : null,
        questionType: formData.activeType,
        difficulty: formData.difficulty,
        questionCount: count,
        timeLimitSeconds: formData.timeEnabled
          ? Number(formData.timeValue) * 60
          : 0,
        pointsPerQuestion: formData.pointsEnabled
          ? Number(formData.pointsValue)
          : 0,
        shuffle: formData.shuffle,
      });

      setQuizSetId(newSet.id);
      setStep(3);

      let rawJson;
      if (sourceTab === "file") {
        rawJson = await generateFromFile(newSet.id, files[0]);
      } else {
        rawJson = await generateFromText(newSet.id, textInput);
      }

      const parsed = parseAIJson(rawJson);
      setRawQuestions(parsed);

      const editable = parsed.map((q, i) => ({
        id: null,
        orderIndex: i,
        question: q.question,
        optionsJson: JSON.stringify(q.options ?? q.statements ?? []),
        correctAnswer: q.correctAnswer ?? null,
        explanation: q.explanation ?? "",
        _raw: q,
      }));
      setEditableQs(editable);
    } catch (e) {
      showToast(
        "Có lỗi xảy ra: " + (e?.response?.data?.message ?? e.message),
        "error",
      );
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestions = async () => {
    if (!quizSetId) return;
    setLoading(true);
    try {
      await saveQuestions(
        quizSetId,
        editableQs.map((q) => ({
          question: q.question,
          optionsJson: q.optionsJson,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          orderIndex: q.orderIndex,
        })),
      );
      setStep(4);
    } catch {
      showToast("Lưu câu hỏi thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateQ = (idx, key, val) =>
    setEditableQs((p) =>
      p.map((q, i) => (i === idx ? { ...q, [key]: val } : q)),
    );

  const removeQ = (idx) => setEditableQs((p) => p.filter((_, i) => i !== idx));

  const count =
    formData.questionCount === "custom"
      ? formData.customCount
      : formData.questionCount;

  const previewFields = [
    { key: "title", label: "Tên quiz", value: formData.title || "—" },
    {
      key: "subject",
      label: "Môn học",
      value:
        subjectOptions.find((s) => s.value === formData.subjectId)?.label ??
        "—",
    },
    {
      key: "diff",
      label: "Cấp độ",
      value:
        DIFFICULTY_OPTIONS.find((d) => d.value === formData.difficulty)
          ?.label ?? "—",
    },
    { key: "count", label: "Số câu", value: `${count} câu` },
    {
      key: "type",
      label: "Loại",
      value:
        QUESTION_TYPES.find((t) => t.value === formData.activeType)?.label ??
        "—",
    },
    {
      key: "time",
      label: "Thời gian",
      value: formData.timeEnabled
        ? `${formData.timeValue} phút`
        : "Không giới hạn",
    },
    {
      key: "score",
      label: "Tổng điểm",
      value: formData.pointsEnabled
        ? `${count * formData.pointsValue} điểm`
        : "—",
    },
  ];

  return (
    <div className="quiz-page-content">
      <Header />
      <div className="quiz-page">
        <Sidebar />
        <main className="quiz-page-main">
          <QuizHeader
            title="Tạo Quiz mới"
            subtitle="Tạo bài kiểm tra tùy chỉnh từ tài liệu hoặc chủ đề bạn muốn"
            onGuide={() => {}}
            onAISuggest={() => {}}
          />

          <StepProgress steps={STEPS} currentStep={step} />

          {/* ─── STEP 1: Chọn nguồn ─── */}
          {step === 1 && (
            <div className="quiz-page-body">
              <div className="quiz-page-left">
                <div className="qc-card">
                  <h2 className="qc-card-title">Chọn nguồn tạo câu hỏi</h2>

                  {/* Source tabs (no icons) */}
                  <div className="qc-source-tabs">
                    {SOURCE_TABS.map((t) => (
                      <button
                        key={t.value}
                        className={`qc-source-tab ${sourceTab === t.value ? "qc-source-tab--active" : ""}`}
                        onClick={() => setSourceTab(t.value)}
                        type="button"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {sourceTab === "file" && (
                    <div className="qc-file-section">
                      <div className="qc-file-list">
                        {fileCards.map((file) => (
                          <UploadFileCard
                            key={file.id}
                            file={file}
                            onRemove={handleFileRemove}
                          />
                        ))}
                      </div>

                      <UploadButton
                        label={fileCards.length === 0 ? "Chọn tài liệu" : "Thêm tài liệu khác"}
                        hint="Hỗ trợ: PDF (Tối đa 10MB mỗi file)"
                        acceptedTypes=".pdf,.docx,.doc,.txt"
                        onFilesSelected={handleFilesSelected}
                      />
                    </div>
                  )}

                  {sourceTab === "text" && (
                    <div className="qc-text-section">
                      <label className="qc-label">Nhập nội dung văn bản</label>
                      <textarea
                        className="qc-textarea"
                        placeholder="Dán nội dung bài học, tài liệu hoặc ghi chú vào đây..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={10}
                      />
                      <span className="qc-char-count">
                        {textInput.length} ký tự
                      </span>
                    </div>
                  )}

                  <div className="qc-bottom">
                    <button
                      className="qc-btn qc-btn-outline"
                      onClick={() => navigate("/quiz")}
                    >
                      ← Quay lại
                    </button>
                    <button
                      className="qc-btn qc-btn-next"
                      onClick={handleStep1Next}
                    >
                      Tiếp tục →
                    </button>
                  </div>
                </div>
              </div>

              <div className="quiz-page-right">
                <div className="qc-tip-card">
                  <div className="qc-tip-icon">💡</div>
                  <div>
                    <div className="qc-tip-title">Mẹo</div>
                    <p className="qc-tip-body">
                      Upload file PDF chứa nội dung bài học, hoặc dán trực tiếp
                      văn bản. AI sẽ tự động phân tích và tạo câu hỏi phù hợp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Cấu hình ─── */}
          {step === 2 && (
            <div className="quiz-page-body">
              <div className="quiz-page-left">
                <QuizConfigForm
                  formData={{
                    ...formData,
                    activeTypes: [formData.activeType],
                  }}
                  subjectOptions={subjectOptions}
                  difficultyOptions={DIFFICULTY_OPTIONS}
                  questionCountPresets={COUNT_PRESETS}
                  questionTypes={QUESTION_TYPES}
                  onFieldChange={(key, val) => {
                    if (key === "subject") field("subjectId", val);
                    else field(key, val);
                  }}
                  onDifficultyChange={(val) => field("difficulty", val)}
                  onCountChange={(val) => field("questionCount", val)}
                  onCustomCountChange={(val) => field("customCount", val)}
                  onTypeToggle={(val) => field("activeType", val)}
                  onToggleChange={field}
                  onInputSettingChange={field}
                  onBack={() => setStep(1)}
                  onNext={handleStep2Next}
                />
                {loading && (
                  <div className="qc-generating">
                    <div className="qc-spinner" />
                    <span>AI đang tạo câu hỏi, vui lòng chờ...</span>
                  </div>
                )}
              </div>

              <div className="quiz-page-right">
                <QuizPreviewCard previewFields={previewFields} />
                <QuizInfoCard
                  title="Thông tin"
                  content={`Sau khi hoàn tất, AI sẽ tạo ${count} câu hỏi ${
                    QUESTION_TYPES.find((t) => t.value === formData.activeType)
                      ?.label
                  } dựa trên nguồn bạn đã chọn.`}
                />
              </div>
            </div>
          )}

          {/* ─── STEP 3: Review câu hỏi ─── */}
          {step === 3 && (
            <div className="qr-wrap">
              <div className="qr-header">
                <div>
                  <h2 className="qr-title">
                    Xem lại câu hỏi ({editableQs.length} câu)
                  </h2>
                  <p className="qr-sub">
                    Chỉnh sửa hoặc xóa câu hỏi trước khi lưu
                  </p>
                </div>
                <div className="qr-actions">
                  <button
                    className="qc-btn qc-btn-outline"
                    onClick={() => setStep(2)}
                  >
                    ← Quay lại
                  </button>
                  <button
                    className="qc-btn qc-btn-next"
                    onClick={handleSaveQuestions}
                    disabled={loading || editableQs.length === 0}
                  >
                    {loading ? "Đang lưu..." : "Hoàn tất & Lưu →"}
                  </button>
                </div>
              </div>

              {loading && editableQs.length === 0 ? (
                <div className="qc-generating">
                  <div className="qc-spinner" />
                  <span>AI đang tạo câu hỏi...</span>
                </div>
              ) : (
                <div className="qr-list">
                  {editableQs.map((q, idx) => (
                    <QuestionReviewCard
                      key={idx}
                      q={q}
                      idx={idx}
                      questionType={formData.activeType}
                      onUpdate={updateQ}
                      onRemove={removeQ}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── STEP 4: Hoàn tất ─── */}
          {step === 4 && (
            <div className="qf-wrap">
              <div className="qf-icon">🎉</div>
              <h2 className="qf-title">Tạo Quiz thành công!</h2>
              <p className="qf-sub">
                Bộ quiz <strong>"{formData.title}"</strong> đã được tạo với{" "}
                {editableQs.length} câu hỏi.
              </p>
              <div className="qf-actions">
                <button
                  className="qc-btn qc-btn-next"
                  onClick={() => navigate(`/quiz/${quizSetId}`)}
                >
                  ▶ Làm bài ngay
                </button>
                <button
                  className="qc-btn qc-btn-outline"
                  onClick={() => navigate("/quiz")}
                >
                  Về danh sách Quiz
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {toast && (
        <div className={`ql-toast ql-toast--${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}

/* ─── QuestionReviewCard (inline component) ─── */
function QuestionReviewCard({ q, idx, questionType, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(true);

  let options = [];
  try {
    options = JSON.parse(q.optionsJson);
  } catch {}

  const isMultiple = questionType === "MULTIPLE_CHOICE";

  return (
    <div className="qr-card">
      <div className="qr-card-top">
        <span className="qr-q-num">Câu {idx + 1}</span>
        <div className="qr-card-tools">
          <button
            className="qr-tool-btn"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Thu gọn" : "Mở rộng"}
          </button>
          <button
            className="qr-tool-btn qr-tool-btn--danger"
            onClick={() => onRemove(idx)}
          >
            Xóa
          </button>
        </div>
      </div>

      <textarea
        className="qr-q-text"
        value={q.question}
        onChange={(e) => onUpdate(idx, "question", e.target.value)}
        rows={2}
      />

      {expanded && (
        <>
          {isMultiple ? (
            <div className="qr-options">
              {options.map((opt, oi) => {
                const letter = String.fromCharCode(65 + oi);
                const isCorrect = q.correctAnswer === letter;
                return (
                  <div
                    key={oi}
                    className={`qr-option ${isCorrect ? "qr-option--correct" : ""}`}
                  >
                    <span
                      className="qr-option-letter"
                      onClick={() => onUpdate(idx, "correctAnswer", letter)}
                      title="Click để đặt là đáp án đúng"
                    >
                      {isCorrect ? "✅" : letter}
                    </span>
                    <input
                      className="qr-option-input"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[oi] = e.target.value;
                        onUpdate(idx, "optionsJson", JSON.stringify(newOpts));
                      }}
                    />
                  </div>
                );
              })}
              <p className="qr-hint">Click chữ cái để đặt đáp án đúng</p>
            </div>
          ) : (
            <div className="qr-statements">
              {options.map((stmt, si) => (
                <div key={si} className="qr-stmt">
                  <span
                    className={`qr-stmt-answer ${stmt.answer ? "true" : "false"}`}
                  >
                    {stmt.answer ? "Đúng" : "Sai"}
                  </span>
                  <input
                    className="qr-option-input"
                    value={stmt.content ?? stmt}
                    onChange={(e) => {
                      const newStmts = [...options];
                      newStmts[si] = {
                        ...newStmts[si],
                        content: e.target.value,
                      };
                      onUpdate(idx, "optionsJson", JSON.stringify(newStmts));
                    }}
                  />
                  <button
                    className="qr-toggle-tf"
                    onClick={() => {
                      const newStmts = [...options];
                      newStmts[si] = {
                        ...newStmts[si],
                        answer: !newStmts[si].answer,
                      };
                      onUpdate(idx, "optionsJson", JSON.stringify(newStmts));
                    }}
                  >
                    Đổi
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="qr-explanation">
            <label className="qr-exp-label">Giải thích:</label>
            <input
              className="qr-exp-input"
              value={q.explanation}
              onChange={(e) => onUpdate(idx, "explanation", e.target.value)}
              placeholder="Nhập giải thích cho đáp án..."
            />
          </div>
        </>
      )}
    </div>
  );
}