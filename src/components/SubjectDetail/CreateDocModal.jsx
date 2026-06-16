import { useState } from "react";
import { FileText, X, Sparkles } from "lucide-react";
import "./CreateDocModal.css";

export default function CreateDocModal({ onClose, onCreate }) {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    const name = fileName.trim() || "Tài liệu mới";
    setLoading(true);
    await onCreate(name);
    setLoading(false);
  };

  return (
    <div className="cdm-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cdm-modal">

        <div className="cdm-header">
          <div className="cdm-header-icon">
            <FileText size={20} color="#2563eb"/>
          </div>
          <div>
            <div className="cdm-title">Tạo tài liệu mới</div>
            <div className="cdm-subtitle">Tài liệu Word trống, sẵn sàng để soạn thảo</div>
          </div>
          <button className="cdm-close" onClick={onClose}>
            <X size={16}/>
          </button>
        </div>

        <div className="cdm-body">
          <label className="cdm-label">Tên tài liệu</label>
          <input
            className="cdm-input"
            placeholder="Ví dụ: Bài tập chương 1"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          <div className="cdm-hint">
            Đuôi <strong>.docx</strong> sẽ được tự động thêm vào
          </div>
        </div>

        <div className="cdm-footer">
          <button className="cdm-btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="cdm-btn-create"
            onClick={handleSubmit} disabled={loading}>
            <Sparkles size={14}/>
            {loading ? "Đang tạo..." : "Tạo & Mở soạn thảo"}
          </button>
        </div>

      </div>
    </div>
  );
}