import { useState, useEffect, useRef } from "react";
import {
  Upload, Eye, Edit2, Trash2, X,
  Save, FileText, File, Plus
} from "lucide-react";
import {
  uploadDocument,
  getDocumentsBySubject,
  deleteDocument,
  viewDocument,
  editDocument,
  countDocuments,
  openFile,     
  createEmptyDocument,
} from "../../services/document.services";
import "./DocumentTab.css";
import DocxEditor from "./DocxEditor"; 
import PdfViewerWithAnnotations from "./PdfViewerWithAnnotations";
import CreateDocModal from "./CreateDocModal";

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
  const [docxEditorDoc, setDocxEditorDoc] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Khi click nút xem PDF
  const getFileUrl = (doc) =>
  `http://localhost:8080/api/subjects/${subjectId}/documents/${doc.documentId}/file`;

const handleViewPdf = (doc) => {
  setViewingDoc(doc);
};

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

  if (doc.fileType === "PDF") {
    // ✅ PDF → mở viewer nội bộ có annotation
    setViewingDoc(doc);
  } else {
    // DOCX → vẫn mở tab mới như cũ
    try {
      await openFile(subjectId, doc.documentId);
    } catch {
      showToast("Không thể mở file, thử lại!", "error");
    }
  }
};
//tạo docx mới
const handleCreateEmpty = async (fileName) => {
  try {
    const newDoc = await createEmptyDocument(subjectId, fileName);
    setShowCreateModal(false);
    // Reload list để có doc mới
    await fetchAll();
    // Mở thẳng editor với doc vừa tạo
    setDocxEditorDoc(newDoc);
    showToast("Đã tạo tài liệu mới!");
  } catch {
    showToast("Tạo tài liệu thất bại!", "error");
  }
};

  /* ── Mở modal chỉnh sửa Word ── */
  const handleOpenEdit = (doc) => {
    setDocxEditorDoc(doc);
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
  
  // ✅ Thêm dòng này để debug — xem documentId thực sự là gì
  console.log("Deleting doc:", doc.documentId, typeof doc.documentId);
  
  try {
    await deleteDocument(subjectId, doc.documentId);
    setDocs(prev => prev.filter(d => d.documentId !== doc.documentId));
    setCount(prev => {
      if (!prev) return prev;
      const isPdf  = doc.fileType === "PDF";
      const isDocx = doc.fileType === "DOCX";
      const updated = {
        ...prev,
        totalDocuments: prev.totalDocuments - 1,
        totalPdf:  isPdf  ? prev.totalPdf  - 1 : prev.totalPdf,
        totalDocx: isDocx ? prev.totalDocx - 1 : prev.totalDocx,
      };
      onCountChange?.(updated.totalDocuments);
      return updated;
    });
    showToast("Đã xóa tài liệu");
  } catch (err) {
    // ✅ Log lỗi chi tiết
    console.error("Delete error:", err.response?.status, err.response?.data);
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

      {/* ── Action bar ── */}
<div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
  {/* Nút tạo tài liệu trống */}
  <button
    onClick={() => setShowCreateModal(true)}
    style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "8px 16px",
      background: "#2563eb", color: "#fff",
      border: "none", borderRadius: 9,
      fontSize: 13, fontWeight: 600, cursor: "pointer",
      transition: "opacity 0.15s",
    }}
    onMouseOver={e => e.currentTarget.style.opacity="0.88"}
    onMouseOut={e => e.currentTarget.style.opacity="1"}
  >
    <Plus size={15}/> Tạo tài liệu trống
  </button>
</div>


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

{/* ── PDF Viewer với Annotations ── */}
{viewingDoc && viewingDoc.fileType === "PDF" && (
  <div className="pdf-modal-overlay">
    <div className="pdf-modal">

      {/* Header modal */}
      <div className="pdf-modal-header">
        <div className="pdf-modal-title">
          <FileIcon type="PDF" />
          <span>{viewingDoc.fileName}</span>
        </div>
        <button
          className="pdf-modal-close"
          onClick={() => setViewingDoc(null)}
        >
          <X size={18} />
        </button>
      </div>

      {/* Nội dung viewer */}
      <div className="pdf-modal-body">
        <PdfViewerWithAnnotations
          subjectId={subjectId}
          documentId={viewingDoc.documentId}
          fileUrl={getFileUrl(viewingDoc)}
        />
      </div>

    </div>
  </div>
)}

{/* Modal tạo tài liệu trống */}
{showCreateModal && (
  <CreateDocModal
    onClose={() => setShowCreateModal(false)}
    onCreate={handleCreateEmpty}
  />
)}
      {/* ── DocxEditor ── */}
{docxEditorDoc && docxEditorDoc.fileName && (
  <DocxEditor
    doc={docxEditorDoc}
    subjectId={subjectId}
    onClose={() => setDocxEditorDoc(null)}
    onSaved={(updated) => {
      setDocs(prev =>
        prev.map(d => d.documentId === updated.documentId ? updated : d)
      );
      setDocxEditorDoc(null);
      showToast("Lưu thành công!");
    }}
  />
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