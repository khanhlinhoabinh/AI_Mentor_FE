import { BookOpen, FileText, X, Save } from "lucide-react";
import "./CreateSubject.css";

export default function CreateSubject({
  onClose,
}) {
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

        <form className="create-form">

          <div className="form-group">

            <label>
              Tên môn học <span>*</span>
            </label>

            <div className="input-wrapper">
              <BookOpen size={18} />

              <input
                type="text"
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
            >
              <Save size={18} />
              Tạo môn học
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}