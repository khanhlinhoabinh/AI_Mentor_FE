import { useState, useCallback } from "react";
import { X } from "lucide-react";
import styles from "./CreateMilestoneModal.module.css";

const INITIAL_FORM = {
  milestoneTitle: "",
  dueDate: "",
};

export default function CreateMilestoneModal({ stageName, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const canSubmit =
    form.milestoneTitle.trim().length > 0 && Boolean(form.dueDate) && !submitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        milestoneTitle: form.milestoneTitle.trim(),
        dueDate: form.dueDate,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tạo milestone. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, form, onSubmit, onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Thêm milestone</h3>
            {stageName && <p className={styles.subtitle}>Cho giai đoạn: {stageName}</p>}
          </div>

          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Tên milestone</label>
          <input
            type="text"
            className={styles.input}
            value={form.milestoneTitle}
            onChange={updateField("milestoneTitle")}
            placeholder="Ví dụ: Hoàn thành API xác thực"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Due date</label>
          <input
            type="date"
            className={styles.input}
            value={form.dueDate}
            onChange={updateField("dueDate")}
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Hủy
          </button>
          <button type="button" className={styles.submitBtn} onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? "Đang tạo..." : "Tạo milestone"}
          </button>
        </div>
      </div>
    </div>
  );
}