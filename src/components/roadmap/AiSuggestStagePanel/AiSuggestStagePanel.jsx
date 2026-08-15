import { useState } from "react";
import { Sparkles, Wand2, X, ArrowLeft, Loader2, CheckSquare, Square } from "lucide-react";
import { suggestRoadmapStages } from "../../../services/roadmapAi.services";
import { createTask } from "../../../services/roadmapTask.services";
import styles from "./AiSuggestStagePanel.module.css";

export default function AiSuggestStagePanel({ roadmapId, roadmap, onClose, onStagesCreated }) {
  const [step, setStep] = useState("form"); // "form" | "preview"
  const [form, setForm] = useState({
    topic: roadmap?.title || "",
    description: "",
    startDate: roadmap?.startDate || "",
    endDate: roadmap?.endDate || "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const canGenerate =
    form.topic.trim().length > 0 &&
    Boolean(form.startDate) &&
    Boolean(form.endDate) &&
    !loadingSuggest;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoadingSuggest(true);
    setError(null);

    try {
      const result = await suggestRoadmapStages(roadmapId, {
        roadmapTitle: roadmap?.title || form.topic.trim(),
        topic: form.topic.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description.trim(),
      });

      const list = result || [];
      setSuggestions(list);
      setSelected(new Set(list.map((_, i) => i))); // mặc định chọn hết
      setStep("preview");
    } catch (err) {
      setError(err.response?.data?.message || "AI không thể tạo gợi ý lúc này. Vui lòng thử lại.");
    } finally {
      setLoadingSuggest(false);
    }
  };

  const toggleSelect = (index) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected(selected.size === suggestions.length ? new Set() : new Set(suggestions.map((_, i) => i)));
  };

  const handleConfirm = async () => {
    const chosen = suggestions.filter((_, i) => selected.has(i));
    if (chosen.length === 0) return;

    setCreating(true);
    setError(null);

    try {
      // Lần lượt tạo từng giai đoạn bằng đúng API tạo giai đoạn thủ công đã có
      for (const s of chosen) {
        const created = await createTask({
          roadmapId,
          taskName: s.stageName,
          taskGoal: s.stageGoal,
          startDate: s.startDate,
          endDate: s.endDate,
        });
        onStagesCreated?.(created);
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Có lỗi khi thêm giai đoạn. Một số giai đoạn có thể đã được tạo thành công."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Wand2 size={18} />
            </div>
            <div>
              <h3 className={styles.title}>AI gợi ý giai đoạn</h3>
              <p className={styles.subtitle}>
                {step === "form"
                  ? "Cho AI biết mục tiêu của bạn, AI sẽ đề xuất các giai đoạn phù hợp"
                  : `${suggestions.length} giai đoạn được đề xuất`}
              </p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {step === "form" && (
          <>
            <div className={styles.field}>
              <label className={styles.label}>Chủ đề / kỹ năng cần học</label>
              <input
                type="text"
                className={styles.input}
                value={form.topic}
                onChange={updateField("topic")}
                placeholder="Ví dụ: Java Spring Boot"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Mô tả thêm cho AI (không bắt buộc)</label>
              <textarea
                className={styles.textarea}
                rows={3}
                value={form.description}
                onChange={updateField("description")}
                placeholder="Ví dụ: Tôi sắp thi cuối kỳ, cần ôn cấp tốc, ưu tiên kiến thức trọng tâm..."
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Từ ngày</label>
                <input
                  type="date"
                  className={styles.input}
                  value={form.startDate}
                  onChange={updateField("startDate")}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Đến ngày</label>
                <input
                  type="date"
                  className={styles.input}
                  value={form.endDate}
                  onChange={updateField("endDate")}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Hủy
              </button>
              <button type="button" className={styles.generateBtn} onClick={handleGenerate} disabled={!canGenerate}>
                {loadingSuggest ? (
                  <>
                    <Loader2 size={15} className={styles.spin} />
                    AI đang phân tích...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Gợi ý bằng AI
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {step === "preview" && (
          <>
            <div className={styles.previewToolbar}>
              <button type="button" className={styles.backBtn} onClick={() => setStep("form")}>
                <ArrowLeft size={14} />
                Chỉnh lại yêu cầu
              </button>

              <button type="button" className={styles.selectAllBtn} onClick={toggleSelectAll}>
                {selected.size === suggestions.length ? <CheckSquare size={14} /> : <Square size={14} />}
                {selected.size === suggestions.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button>
            </div>

            {suggestions.length === 0 ? (
              <p className={styles.empty}>AI không đề xuất được giai đoạn nào, hãy thử mô tả rõ hơn.</p>
            ) : (
              <div className={styles.suggestionList}>
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className={`${styles.suggestionCard} ${selected.has(i) ? styles.suggestionCardSelected : ""}`}
                    onClick={() => toggleSelect(i)}
                  >
                    <div className={styles.checkbox}>
                      {selected.has(i) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                    <div className={styles.suggestionBody}>
                      <span className={styles.suggestionOrder}>Giai đoạn {i + 1}</span>
                      <h4 className={styles.suggestionName}>{s.stageName}</h4>
                      <p className={styles.suggestionGoal}>{s.stageGoal}</p>
                      <span className={styles.suggestionDates}>
                        {s.startDate} → {s.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Hủy
              </button>
              <button
                type="button"
                className={styles.generateBtn}
                onClick={handleConfirm}
                disabled={selected.size === 0 || creating}
              >
                {creating ? (
                  <>
                    <Loader2 size={15} className={styles.spin} />
                    Đang thêm...
                  </>
                ) : (
                  `Thêm ${selected.size} giai đoạn vào lộ trình`
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}