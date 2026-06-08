import { useState } from "react";
import { BookOpen, FileText, X, Save } from "lucide-react";
import "./CreateSubject.css";
import { createSubject }
  from "../../../services/subject.services";
export default function CreateSubject({
  onClose,
  onCreated,
}) {
  const [subjectName, setSubjectName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      alert("Vui lòng nhập tên môn học");
      return;
    }

    try {
      setLoading(true);

      const newSubject =
        await createSubject({
          subjectName,
          description,
        });

      console.log(
        "Created subject:",
        newSubject
      );

      alert("Tạo môn học thành công");

      if (onCreated) {
        onCreated(newSubject);
      }

      onClose();

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Tạo môn học thất bại"
      );

    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="create-modal-overlay"
      onClick={onClose}
    >
      <div
        className="create-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="create-close-btn"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div className="create-header">

          <div className="create-icon">
            <BookOpen size={34} />
          </div>

          <div>
            <h1>Tạo môn học mới</h1>
            <p>Nhập thông tin để tạo môn học</p>
          </div>

        </div>

        <form
          className="create-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Tên môn học <span>*</span>
            </label>

            <div className="input-wrapper">
              <BookOpen size={18} />

              <input
                type="text"
                value={subjectName}
                onChange={(e) =>
                  setSubjectName(e.target.value)
                }
                placeholder="Nhập tên môn học"
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
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Nhập mô tả môn học (tùy chọn)"
              />
            </div>

          </div>

          <div className="create-actions">

            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              <X size={18} />
              Hủy
            </button>

            <button
              type="submit"
              className="btn-create"
              disabled={loading}
            >
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