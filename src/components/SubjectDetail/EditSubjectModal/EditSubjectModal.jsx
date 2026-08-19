import { useState } from "react";
import { BookOpen, FileText, X, Save } from "lucide-react";

import { updateSubject } from "../../../services/subject.services";

import { toastSuccess, toastError } from "../../../utils/swal";
import "../../MySubjects/CreateSubjectModal/CreateSubject.css";
export default function EditSubjectModal({ subject, onClose, onUpdated }) {
  const [subjectName, setSubjectName] = useState(subject.subjectName);

  const [description, setDescription] = useState(subject.description || "");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedSubject = await updateSubject(subject.subjectId, {
        subjectName,
        description,
      });

      toastSuccess("Cập nhật thành công");

      onUpdated(updatedSubject);

      onClose();
    } catch (error) {
      console.error(error);

      toastError("cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <button className="create-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="create-header">
          <div className="create-icon">
            <BookOpen size={34} />
          </div>

          <div>
            <h1>Chỉnh sửa môn học</h1>
            <p>Nhập thông tin để chỉnh sửa môn học</p>
          </div>
        </div>

        <form className="create-form" onSubmit={handleSubmit}>
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
              />
            </div>
          </div>
          <div className="form-group">
            <label>Mô tả môn học</label>

            <div className="textarea-wrapper">
              <FileText size={18} />

              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          {/* textarea mô tả */}

          <div className="create-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>

            <button type="submit" className="btn-create">
              {loading ? "Đang cập nhật..." : "Cập nhật môn học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
