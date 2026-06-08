import { useState, useEffect, useRef } from "react";
import {
  Upload, Eye, Edit2, Trash2, X,
  Save, FileText, File
} from "lucide-react";
import {
  uploadDocument,
  getDocumentsBySubject,
  deleteDocument,
  viewDocument,
  editDocument,
  countDocuments,
  openFile,     
} from "../../services/document.services";
import "./DocumentTab.css";

/* ── Helper: format ngày ── */
function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

/* ── Helper: icon theo loại file ── */
function FileIcon({ type }) {
  return (
    <div className={`dt-file-icon ${type?.toLowerCase() === "pdf" ? "pdf" : "docx"}`}>
      {type === "PDF" ? "PDF" : "DOC"}
    </div>
  );
}

/* ── Status badge ── */
function StatusBadge({ status }) {
  const map = {
    UPLOADED: { label: "Mới upload", cls: "uploaded" },
    SEEN:     { label: "Đã xem",     cls: "seen"     },
    EDITED:   { label: "Đã chỉnh sửa", cls: "edited" },
  };
  const s = map[status] ?? map.UPLOADED;
  return <span className={`dt-status ${s.cls}`}>{s.label}</span>;
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function DocumentTab({ subjectId, onCountChange }) {
  const [docs, setDocs]           = useState([]);
  const [count, setCount]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [editDoc, setEditDoc]     = useState(null);   // document đang edit
  const [editText, setEditText]   = useState("");
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);   // { msg, type }
  const fileInputRef = useRef();

  /* ── Load danh sách + count ── */
  const fetchAll = async () => {
    try {
      const [list, cnt] = await Promise.all([
        getDocumentsBySubject(subjectId),
        countDocuments(subjectId),
      ]);
      setDocs(list);
      setCount(cnt);
      // Báo lên SubjectHero cập nhật totalDocs
      onCountChange?.(cnt.totalDocuments);
    } catch {
      showToast("Không thể tải danh sách tài liệu", "error");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    setLoading(false); // ✅ tránh loading mãi mãi
    return;
  }
  fetchAll();
}, [subjectId]);

  /* ── Toast helper ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Upload ── */
  const handleFileSelect = async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx"].includes(ext)) {
      showToast("Chỉ hỗ trợ file PDF và DOCX", "error");
      return;
    }
    setUploading(true);
    try {
      await uploadDocument(subjectId, file);
      showToast("Upload tài liệu thành công!");
      fetchAll();
    } catch {
      showToast("Upload thất bại, thử lại!", "error");
    } finally {
      setUploading(false);
      // Reset input để có thể upload lại cùng file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

 /* ── Xem tài liệu → SEEN + mở file ── */
const handleView = async (doc) => {
  // Cập nhật status SEEN
  try {
    const updated = await viewDocument(subjectId, doc.documentId);
    setDocs(prev =>
      prev.map(d => d.documentId === updated.documentId ? updated : d)
    );
  } catch {
    showToast("Không thể cập nhật trạng thái", "error");
  }

  // Mở file trong tab mới
  try {
    await openFile(subjectId, doc.documentId);
  } catch {
    showToast("Không thể mở file, thử lại!", "error");
  }
};

  /* ── Mở modal chỉnh sửa Word ── */
  const handleOpenEdit = (doc) => {
    setEditDoc(doc);
    setEditText(doc.extractedText ?? "");
  };

  /* ── Lưu chỉnh sửa ── */
  const handleSaveEdit = async () => {
    if (!editDoc) return;
    setSaving(true);
    try {
      const updated = await editDocument(
        subjectId, editDoc.documentId, editText
      );
      setDocs(prev =>
        prev.map(d => d.documentId === updated.documentId ? updated : d)
      );
      showToast("Lưu thành công!");
      setEditDoc(null);
    } catch {
      showToast("Lưu thất bại, thử lại!", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Xóa ── */
  const handleDelete = async (doc) => {
    if (!window.confirm(`Xóa tài liệu "${doc.fileName}"?`)) return;
    try {
      await deleteDocument(subjectId, doc.documentId);
      showToast("Đã xóa tài liệu");
      fetchAll();
    } catch {
      showToast("Xóa thất bại", "error");
    }
  };

  /* ══ RENDER ══ */
  return (
    <div className="dt-wrap">

      {/* ── Stat bar ── */}
      {count && (
        <div className="dt-stat-bar">
          <div className="dt-stat-card">
            <div className="dt-stat-icon green">📄</div>
            <div className="dt-stat-info">
              <div className="dt-stat-num">{count.totalDocuments}</div>
              <div className="dt-stat-label">Tổng tài liệu</div>
            </div>
          </div>
          <div className="dt-stat-card">
            <div className="dt-stat-icon red">📕</div>
            <div className="dt-stat-info">
              <div className="dt-stat-num">{count.totalPdf}</div>
              <div className="dt-stat-label">File PDF</div>
            </div>
          </div>
          <div className="dt-stat-card">
            <div className="dt-stat-icon blue">📘</div>
            <div className="dt-stat-info">
              <div className="dt-stat-num">{count.totalDocx}</div>
              <div className="dt-stat-label">File Word</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Upload zone ── */}
      <div
        className={`dt-upload-zone ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />
        <div className="dt-upload-icon">
          <Upload size={18} />
        </div>
        {uploading ? (
          <>
            <div className="dt-upload-title">Đang upload...</div>
            <div className="dt-upload-progress">
              <div className="dt-upload-progress-bar" style={{ width: "70%" }} />
            </div>
          </>
        ) : (
          <>
            <div className="dt-upload-title">
              Kéo thả file vào đây hoặc <span>chọn file</span>
            </div>
            <div className="dt-upload-hint">
              Hỗ trợ PDF, DOCX • Tối đa 50MB
            </div>
          </>
        )}
      </div>

      {/* ── Danh sách tài liệu ── */}
      <div className="dt-list">
        <div className="dt-list-header">
          <span className="dt-list-title">
            Danh sách tài liệu ({docs.length})
          </span>
        </div>

        {loading ? (
          <div className="dt-loading">Đang tải...</div>
        ) : docs.length === 0 ? (
          <div className="dt-empty">
            <div className="dt-empty-icon">📂</div>
            <div>Chưa có tài liệu nào. Upload file đầu tiên ngay!</div>
          </div>
        ) : (
          docs.map((doc) => (
            <div key={doc.documentId} className="dt-doc-card">

              <FileIcon type={doc.fileType} />

              <div className="dt-doc-info">
                <div className="dt-doc-name">{doc.fileName}</div>
                <div className="dt-doc-meta">
                  <span>{doc.fileType}</span>
                  <span>•</span>
                  <span>{formatDate(doc.createdAt)}</span>
                  <span>•</span>
                  <StatusBadge status={doc.status} />
                </div>
              </div>

              <div className="dt-doc-actions">
                {/* Xem */}
                <button
                  className="dt-action-btn view"
                  title="Xem tài liệu"
                  onClick={() => handleView(doc)}
                >
                  <Eye size={14} />
                </button>

                {/* Chỉnh sửa — chỉ hiện với DOCX */}
                {doc.fileType === "DOCX" && (
                  <button
                    className="dt-action-btn edit"
                    title="Chỉnh sửa nội dung"
                    onClick={() => handleOpenEdit(doc)}
                  >
                    <Edit2 size={14} />
                  </button>
                )}

                {/* Xóa */}
                <button
                  className="dt-action-btn delete"
                  title="Xóa tài liệu"
                  onClick={() => handleDelete(doc)}
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editDoc && (
        <div
          className="dt-edit-overlay"
          onClick={(e) => e.target === e.currentTarget && setEditDoc(null)}
        >
          <div className="dt-edit-modal">
            <div className="dt-edit-header">
              <div className="dt-edit-title">
                <Edit2 size={16} color="#22c55e" />
                Chỉnh sửa: {editDoc.fileName}
              </div>
              <button
                className="dt-edit-close"
                onClick={() => setEditDoc(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="dt-edit-body">
              <div className="dt-edit-label">Nội dung tài liệu</div>
              <textarea
                className="dt-edit-textarea"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Nhập nội dung tài liệu..."
              />
            </div>

            <div className="dt-edit-footer">
              <button
                className="dt-btn-cancel"
                onClick={() => setEditDoc(null)}
              >
                Hủy
              </button>
              <button
                className="dt-btn-save"
                onClick={handleSaveEdit}
                disabled={saving}
              >
                <Save size={14} />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`dt-toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}