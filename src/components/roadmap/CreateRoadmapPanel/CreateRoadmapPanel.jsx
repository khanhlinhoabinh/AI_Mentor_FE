import { useState, useEffect, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { getSubjects } from "../../../services/subject.services";
import { createRoadmap } from "../../../services/roadmap.services";
import styles from "./CreateRoadmapPanel.module.css";

const INITIAL_FORM = {
  subjectId: "",
  roadmapTitle: "",
  learningGoal: "",
  startDate: "",
  endDate: "",
};

export default function CreateRoadmapPanel({ onCreated }) {
  const [isOpen, setIsOpen] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [subjectsLoaded, setSubjectsLoaded] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Chỉ load danh sách môn học khi người dùng thật sự mở form (lazy load)
  useEffect(() => {
    if (!isOpen || subjectsLoaded) return;

    let ignore = false;

    async function loadSubjects() {
      setLoadingSubjects(true);

      try {
        const data = await getSubjects();
        if (!ignore) setSubjects(data || []);
      } catch (err) {
        if (!ignore) setError("Không thể tải danh sách môn học.");
      } finally {
        if (!ignore) {
          setLoadingSubjects(false);
          setSubjectsLoaded(true);
        }
      }
    }

    loadSubjects();
    return () => { ignore = true; };
  }, [isOpen, subjectsLoaded]);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const canSubmit =
    Boolean(form.subjectId) &&
    form.roadmapTitle.trim().length > 0 &&
    form.learningGoal.trim().length > 0 &&
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
      const created = await createRoadmap({
        subjectId: Number(form.subjectId),
        roadmapTitle: form.roadmapTitle.trim(),
        learningGoal: form.learningGoal.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
      });

      onCreated?.(created);
      resetAndClose();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tạo roadmap. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, form, onCreated]);

  return (
    <section className={styles.wrapper}>
      <button type="button" className={styles.toggleBtn} onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? <X size={16} /> : <Plus size={16} />}
        {isOpen ? "Đóng" : "Tạo roadmap mới"}
      </button>

      {isOpen && (
        <div className={styles.card}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label className={styles.label}>Môn học</label>
            <select
              className={styles.select}
              value={form.subjectId}
              onChange={updateField("subjectId")}
              disabled={loadingSubjects}
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tên roadmap</label>
            <input
              type="text"
              className={styles.input}
              value={form.roadmapTitle}
              onChange={updateField("roadmapTitle")}
              placeholder="Ví dụ: Roadmap Java OOP"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mục tiêu học tập</label>
            <textarea
              className={styles.textarea}
              rows={2}
              value={form.learningGoal}
              onChange={updateField("learningGoal")}
              placeholder="Ví dụ: Thành thạo Java OOP trong 45 ngày"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Ngày bắt đầu</label>
              <input type="date" className={styles.input} value={form.startDate} onChange={updateField("startDate")} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Ngày kết thúc</label>
              <input type="date" className={styles.input} value={form.endDate} onChange={updateField("endDate")} />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={resetAndClose}>
              Hủy
            </button>
            <button type="button" className={styles.submitBtn} onClick={handleSubmit} disabled={!canSubmit}>
              {submitting ? "Đang tạo..." : "Tạo roadmap"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}