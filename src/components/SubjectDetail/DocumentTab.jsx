import { useState, useEffect, useRef, useMemo } from "react";
import {
  Upload, Eye, Edit2, Trash2, X, Save,
  Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react";
import {
  uploadDocument, getDocumentsBySubject, deleteDocument,
  viewDocument, editDocument, countDocuments, openFile,
  createEmptyDocument,
} from "../../services/document.services";
import DocxEditor from "./DocxEditor";
import CreateDocModal from "./CreateDocModal";
import "./DocumentTab.css";

/* ── Helpers ── */
function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function FileIcon({ type }) {
  return (
    <div className={`dt-file-icon ${type?.toLowerCase() === "pdf" ? "pdf" : "docx"}`}>
      {type === "PDF" ? "PDF" : "DOC"}
    </div>
  );
}

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
   SORT OPTIONS
══════════════════════════════════════ */
const SORT_OPTIONS = [
  { key: "date_desc",   label: "Mới nhất",        icon: <ArrowDown size={12}/> },
  { key: "date_asc",    label: "Cũ nhất",          icon: <ArrowUp size={12}/>   },
  { key: "edited_desc", label: "Chỉnh sửa gần nhất", icon: <ArrowDown size={12}/> },
  { key: "name_asc",    label: "Tên A→Z",          icon: <ArrowUp size={12}/>   },
  { key: "name_desc",   label: "Tên Z→A",          icon: <ArrowDown size={12}/> },
];

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function DocumentTab({ subjectId, onCountChange }) {
  const [docs,          setDocs]          = useState([]);
  const [count,         setCount]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [uploading,     setUploading]     = useState(false);
  const [dragOver,      setDragOver]      = useState(false);
  const [docxEditorDoc, setDocxEditorDoc] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [toast,         setToast]         = useState(null);

  /* ── Search / Filter / Sort state ── */
  const [search,   setSearch]   = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL | PDF | DOCX
  const [sortKey,  setSortKey]  = useState("date_desc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const fileInputRef = useRef();
  const sortMenuRef  = useRef();

  /* ── Load data ── */
  const fetchAll = async () => {
    try {
      const [list, cnt] = await Promise.all([
        getDocumentsBySubject(subjectId),
        countDocuments(subjectId),
      ]);
      setDocs(list);
      setCount(cnt);
      onCountChange?.(cnt.totalDocuments);
    } catch {
      showToast("Không thể tải danh sách tài liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    fetchAll();
  }, [subjectId]);

  /* ── Đóng sort menu khi click ra ngoài ── */
  useEffect(() => {
    const handler = (e) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ══ SEARCH + FILTER + SORT (useMemo) ══ */
  const filteredDocs = useMemo(() => {
    let result = [...docs];

    // 1. Tìm kiếm theo tên
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(d =>
        d.fileName.toLowerCase().includes(q)
      );
    }

    // 2. Lọc theo loại
    if (typeFilter !== "ALL") {
      result = result.filter(d => d.fileType === typeFilter);
    }

    // 3. Sắp xếp
    result.sort((a, b) => {
      switch (sortKey) {
        case "date_desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date_asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "edited_desc": {
          // Ưu tiên lastEditedAt, fallback updatedAt, rồi createdAt
          const ta = new Date(a.lastEditedAt || a.updatedAt || a.createdAt);
          const tb = new Date(b.lastEditedAt || b.updatedAt || b.createdAt);
          return tb - ta;
        }
        case "name_asc":
          return a.fileName.localeCompare(b.fileName, "vi");
        case "name_desc":
          return b.fileName.localeCompare(a.fileName, "vi");
        default:
          return 0;
      }
    });

    return result;
  }, [docs, search, typeFilter, sortKey]);

  /* ── Toast ── */
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  /* ── View ── */
  const handleView = async (doc) => {
    try {
      const updated = await viewDocument(subjectId, doc.documentId);
      setDocs(prev => prev.map(d => d.documentId === updated.documentId ? updated : d));
    } catch {
      showToast("Không thể cập nhật trạng thái", "error");
    }
    try { await openFile(subjectId, doc.documentId); } catch {
      showToast("Không thể mở file!", "error");
    }
  };

  /* ── Edit ── */
  const handleOpenEdit = (doc) => {
    if (!doc?.fileName) return;
    setDocxEditorDoc(doc);
  };

  /* ── Delete ── */
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

  /* ── Create empty ── */
  const handleCreateEmpty = async (fileName) => {
    try {
      const newDoc = await createEmptyDocument(subjectId, fileName);
      setShowCreateModal(false);
      await fetchAll();
      setDocxEditorDoc(newDoc);
      showToast("Đã tạo tài liệu mới!");
    } catch {
      showToast("Tạo tài liệu thất bại!", "error");
    }
  };

  /* ── Current sort label ── */
  const currentSort = SORT_OPTIONS.find(s => s.key === sortKey);

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
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"8px 16px",
            background:"#2563eb", color:"#fff",
            border:"none", borderRadius:9,
            fontSize:13, fontWeight:600, cursor:"pointer",
          }}
        >
          + Tạo tài liệu trống
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
        <div className="dt-upload-icon"><Upload size={18}/></div>
        {uploading ? (
          <>
            <div className="dt-upload-title">Đang upload...</div>
            <div className="dt-upload-progress">
              <div className="dt-upload-progress-bar" style={{ width:"70%" }}/>
            </div>
          </>
        ) : (
          <>
            <div className="dt-upload-title">
              Kéo thả file vào đây hoặc <span>chọn file</span>
            </div>
            <div className="dt-upload-hint">Hỗ trợ PDF, DOCX • Tối đa 50MB</div>
          </>
        )}
      </div>

      {/* ══ SEARCH / FILTER / SORT BAR ══ */}
      <div className="dt-toolbar">

        {/* Tìm kiếm */}
        <div className="dt-search-wrap">
          <span className="dt-search-icon">
            <Search size={14}/>
          </span>
          <input
            className="dt-search-input"
            placeholder="Tìm kiếm tên file..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="dt-search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        {/* Lọc theo loại */}
        <select
          className="dt-filter-select"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          title="Lọc theo loại file"
        >
          <option value="ALL">Tất cả loại</option>
          <option value="PDF">📕 PDF</option>
          <option value="DOCX">📘 DOCX</option>
        </select>

        {/* Sắp xếp */}
        <div style={{ position:"relative" }} ref={sortMenuRef}>
          <button
            className={`dt-sort-btn ${showSortMenu ? "active" : ""}`}
            onClick={() => setShowSortMenu(v => !v)}
          >
            <ArrowUpDown size={13}/>
            {currentSort?.label}
          </button>

          {showSortMenu && (
            <div style={{
              position:"absolute", top:"calc(100% + 6px)", right:0,
              background:"#fff",
              border:"1px solid #e2e8f0",
              borderRadius:10,
              boxShadow:"0 8px 24px rgba(0,0,0,0.1)",
              zIndex:100,
              minWidth:180,
              overflow:"hidden",
            }}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => { setSortKey(opt.key); setShowSortMenu(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:8,
                    width:"100%", padding:"9px 14px",
                    background: sortKey === opt.key ? "#f0fdf4" : "transparent",
                    color: sortKey === opt.key ? "#22c55e" : "#374151",
                    border:"none", cursor:"pointer",
                    fontSize:12, fontWeight: sortKey === opt.key ? 600 : 400,
                    textAlign:"left",
                    transition:"background 0.12s",
                  }}
                  onMouseOver={e => {
                    if (sortKey !== opt.key)
                      e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseOut={e => {
                    if (sortKey !== opt.key)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {opt.icon}
                  {opt.label}
                  {sortKey === opt.key && (
                    <span style={{ marginLeft:"auto", color:"#22c55e" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Danh sách tài liệu ── */}
      <div className="dt-list">
        <div className="dt-list-header">
          <span className="dt-list-title">
            Danh sách tài liệu ({filteredDocs.length}
            {filteredDocs.length !== docs.length && `/${docs.length}`})
          </span>
          {(search || typeFilter !== "ALL") && (
            <button
              onClick={() => { setSearch(""); setTypeFilter("ALL"); }}
              style={{
                background:"none", border:"none",
                color:"#94a3b8", fontSize:11, cursor:"pointer",
                textDecoration:"underline",
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {loading ? (
          <div className="dt-loading">Đang tải...</div>
        ) : docs.length === 0 ? (
          <div className="dt-empty">
            <div className="dt-empty-icon">📂</div>
            <div>Chưa có tài liệu nào. Upload file đầu tiên ngay!</div>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="dt-no-result">
            <div className="dt-no-result-icon">🔍</div>
            <div>Không tìm thấy tài liệu phù hợp</div>
            <button
              onClick={() => { setSearch(""); setTypeFilter("ALL"); }}
              style={{
                marginTop:8, background:"none", border:"1px solid #e2e8f0",
                borderRadius:6, padding:"4px 12px",
                fontSize:11, color:"#64748b", cursor:"pointer",
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div key={doc.documentId} className="dt-doc-card">
              <FileIcon type={doc.fileType}/>

              <div className="dt-doc-info">
                <div className="dt-doc-name">{doc.fileName}</div>
                <div className="dt-doc-meta">
                  <span>{doc.fileType}</span>
                  <span>•</span>
                  <span>{formatDate(doc.createdAt)}</span>
                  {doc.lastEditedAt && (
                    <>
                      <span>•</span>
                      <span style={{ color:"#22c55e" }}>
                        Sửa: {formatDate(doc.lastEditedAt)}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <StatusBadge status={doc.status}/>
                </div>
              </div>

              <div className="dt-doc-actions">
                <button className="dt-action-btn view" title="Xem tài liệu"
                  onClick={() => handleView(doc)}>
                  <Eye size={14}/>
                </button>
                {doc.fileType === "DOCX" && (
                  <button className="dt-action-btn edit" title="Chỉnh sửa"
                    onClick={() => handleOpenEdit(doc)}>
                    <Edit2 size={14}/>
                  </button>
                )}
                <button className="dt-action-btn delete" title="Xóa"
                  onClick={() => handleDelete(doc)}>
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Modals ── */}
      {showCreateModal && (
        <CreateDocModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEmpty}
        />
      )}

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
        <div className={`dt-toast ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}