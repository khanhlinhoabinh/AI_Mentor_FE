import { useState } from "react";
import { BookOpen, FileText, X, Save } from "lucide-react";

import "./CreateSubject.css";

import { alertWarning, alertSuccess, alertError } from "../../../utils/swal";

import { createSubject } from "../../../services/subject.services";

export default function CreateSubject({ onClose, onCreated }) {
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // VALIDATE
    // =========================
    if (!subjectName.trim()) {
      await alertWarning("Thiếu thông tin", "Vui lòng nhập tên môn học");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // CREATE SUBJECT
      // =========================
      const newSubject = await createSubject({
        subjectName: subjectName.trim(),
        description: description.trim(),
      });

      console.log("Created subject:", newSubject);

      // =========================
      // ĐÓNG MODAL TRƯỚC
      // =========================
      onClose();

      // =========================
      // CẬP NHẬT DANH SÁCH
      // =========================
      if (onCreated) {
        await onCreated(newSubject);
      }

      // =========================
      // HIỆN SUCCESS SAU KHI MODAL ĐÃ ĐÓNG
      // =========================
      await alertSuccess("Thành công!", "Tạo môn học thành công");
    } catch (error) {
      console.error("Create subject failed:", error);

      await alertError(
        "Thất bại",
        error?.response?.data?.message || "Không thể tạo môn học",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        {/* =========================
            CLOSE BUTTON
        ========================= */}
        <button
          type="button"
          className="create-close-btn"
          onClick={onClose}
          disabled={loading}
        >
          <X size={24} />
        </button>

        {/* =========================
            HEADER
        ========================= */}
        <div className="create-header">
          <div className="create-icon">
            <BookOpen size={34} />
          </div>

          <div>
            <h1>Tạo môn học mới</h1>

            <p>Nhập thông tin để tạo môn học</p>
          </div>
        </div>

        {/* =========================
            FORM
        ========================= */}
        <form className="create-form" onSubmit={handleSubmit}>
          {/* =========================
              SUBJECT NAME
          ========================= */}
          <div className="form-group">
            <label>
              Tên môn học <span>*</span>
            </label>

            <div className="input-wrapper">
              <BookOpen size={18} />

              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Nhập tên môn học"
                disabled={loading}
              />
            </div>
          </div>

          {/* =========================
              DESCRIPTION
          ========================= */}
          <div className="form-group">
            <label>Mô tả môn học</label>

            <div className="textarea-wrapper">
              <FileText size={18} />

              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả môn học (tùy chọn)"
                disabled={loading}
              />
            </div>
          </div>

          {/* =========================
              ACTIONS
          ========================= */}
          <div className="create-actions">
            {/* CANCEL */}
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              <X size={18} />
              Hủy
            </button>

            {/* CREATE */}
            <button type="submit" className="btn-create" disabled={loading}>
              {loading ? (
                <>
                  <Save size={18} />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Tạo môn học
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
