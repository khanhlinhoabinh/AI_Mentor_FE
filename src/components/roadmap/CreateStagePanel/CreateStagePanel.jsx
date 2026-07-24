import { useState, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { createTask } from "../../../services/roadmapTask.services";
import styles from "./CreateStagePanel.module.css";

const INITIAL_FORM = {
  taskName: "",
  taskGoal: "",
  startDate: "",
  endDate: "",
};

export default function CreateStagePanel({ roadmapId, onCreated, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const canSubmit =
    Boolean(roadmapId) &&
    form.taskName.trim().length > 0 &&
    form.taskGoal.trim().length > 0 &&
    Boolean(form.startDate) &&
    Boolean(form.endDate) &&
    !submitting;

  const resetAndClose = () => {
    setForm(INITIAL_FORM);
    setError(null);
    setIsOpen(false);
  };

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const created = await createTask({
        roadmapId,
        taskName: form.taskName.trim(),
        taskGoal: form.taskGoal.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
      });

      onCreated?.(created);
      resetAndClose();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tạo giai đoạn. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, form, roadmapId, onCreated]);

  if (disabled) return null;

  return (
    <section className={styles.wrapper}>
      <button type="button" className={styles.toggleBtn} onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? <X size={15} /> : <Plus size={15} />}
        {isOpen ? "Đóng" : "Thêm giai đoạn"}
      </button>

      {isOpen && (
        <div className={styles.card}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label className={styles.label}>Tên giai đoạn</label>
            <input
              type="text"
              className={styles.input}
              value={form.taskName}
              onChange={updateField("taskName")}
              placeholder="Ví dụ: Backend"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mục tiêu giai đoạn</label>
            <textarea
              className={styles.textarea}
              rows={2}
              value={form.taskGoal}
              onChange={updateField("taskGoal")}
              placeholder="Ví dụ: Xây dựng REST API với Spring Boot"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Ngày bắt đầu</label>
              <input
                type="date"
                className={styles.input}
                value={form.startDate}
                onChange={updateField("startDate")}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Ngày kết thúc</label>
              <input
                type="date"
                className={styles.input}
                value={form.endDate}
                onChange={updateField("endDate")}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={resetAndClose}>
              Hủy
            </button>
            <button type="button" className={styles.submitBtn} onClick={handleSubmit} disabled={!canSubmit}>
              {submitting ? "Đang tạo..." : "Tạo giai đoạn"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}