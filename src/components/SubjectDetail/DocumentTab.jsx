import { useState, useEffect, useRef, useMemo } from "react";
import {
  Upload,
  Eye,
  Edit2,
  Trash2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  X,
  ShieldAlert,
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
import DocxEditor from "./DocxEditor";
import CreateDocModal from "./CreateDocModal";
import "./DocumentTab.css";

/* ══ Helpers ══ */
function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function FileIcon({ type }) {
  return (
    <div
      className={`dt-file-icon ${type?.toLowerCase() === "pdf" ? "pdf" : "docx"}`}
    >
      {type === "PDF" ? "PDF" : "DOC"}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    UPLOADED: { label: "Mới upload", cls: "uploaded" },
    SEEN: { label: "Đã xem", cls: "seen" },
    EDITED: { label: "Đã chỉnh sửa", cls: "edited" },
  };
  const s = map[status] ?? map.UPLOADED;
  return <span className={`dt-status ${s.cls}`}>{s.label}</span>;
}

/* ── Risk badge nhỏ hiển thị trong card ── */
function RiskBadge({ level }) {
  if (!level || level === "NONE" || level === "SAFE") return null;
  const map = {
    HIGH: { icon: "🔴", label: "Rủi ro cao" },
    MEDIUM: { icon: "🟡", label: "Rủi ro TB" },
    LOW: { icon: "🟢", label: "Rủi ro thấp" },
  };
  const info = map[level];
  if (!info) return null;
  return (
    <span className={`dt-risk-badge dt-risk-badge--${level}`}>
      {info.icon} {info.label}
    </span>
  );
}

/* ── Modal chi tiết vi phạm ── */
function ViolationModal({ doc, onClose }) {
  if (!doc) return null;

  const riskMap = {
    HIGH: { icon: "🔴", label: "Cao", cls: "HIGH" },
    MEDIUM: { icon: "🟡", label: "Trung bình", cls: "MEDIUM" },
    LOW: { icon: "🟢", label: "Thấp", cls: "LOW" },
  };
  const risk = riskMap[doc.moderationRiskLevel] ?? riskMap.LOW;

  // Parse categories nếu là string JSON
  let cats = [];
  try {
    cats =
      typeof doc.moderationCategories === "string"
        ? JSON.parse(doc.moderationCategories)
        : (doc.moderationCategories ?? []);
  } catch {
    cats = [];
  }

  return (
    <div
      className="dt-mod-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dt-mod-modal">
        {/* Header */}
        <div className="dt-mod-header">
          <div className="dt-mod-header-left">
            <div className="dt-mod-header-icon">⚠️</div>
            <div>
              <div className="dt-mod-header-title">
                Cảnh báo nội dung vi phạm
              </div>
              <div className="dt-mod-header-sub">{doc.fileName}</div>
            </div>
          </div>
          <button className="dt-mod-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="dt-mod-body">
          {/* Risk level */}
          <div className="dt-mod-risk-row">
            <span className="dt-mod-risk-label">Mức độ rủi ro:</span>
            <div className={`dt-mod-risk-pill dt-mod-risk-pill--${risk.cls}`}>
              {risk.icon} {risk.label}
            </div>
          </div>

          {/* Summary */}
          {doc.moderationSummary && (
            <div>
              <div className="dt-mod-section-title">Tóm tắt phân tích</div>
              <div className="dt-mod-summary">{doc.moderationSummary}</div>
            </div>
          )}

          {/* Warning */}
          {doc.moderationWarning && (
            <div className="dt-mod-warning">
              <span>⚠️</span>
              <span>{doc.moderationWarning}</span>
            </div>
          )}

          {/* Categories */}
          {cats.length > 0 && (
            <div>
              <div className="dt-mod-section-title">Loại vi phạm phát hiện</div>
              <div className="dt-mod-categories">
                {cats.map((c, i) => (
                  <span key={i} className="dt-mod-cat-tag">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="dt-mod-footer">
          <button className="dt-mod-ok-btn" onClick={onClose}>
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ Sort options ══ */
const SORT_OPTIONS = [
  { key: "date_desc", label: "Mới nhất", icon: <ArrowDown size={12} /> },
  { key: "date_asc", label: "Cũ nhất", icon: <ArrowUp size={12} /> },
  {
    key: "edited_desc",
    label: "Chỉnh sửa gần nhất",
    icon: <ArrowDown size={12} />,
  },
  { key: "name_asc", label: "Tên A→Z", icon: <ArrowUp size={12} /> },
  { key: "name_desc", label: "Tên Z→A", icon: <ArrowDown size={12} /> },
  {
    key: "violation",
    label: "Vi phạm trước",
    icon: <AlertTriangle size={12} />,
  },
];

/* ══ Main component ══ */
export default function DocumentTab({ subjectId, onCountChange }) {
  const [docs, setDocs] = useState([]);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [checking, setChecking] = useState(false); // đang kiểm duyệt
  const [dragOver, setDragOver] = useState(false);
  const [docxEditorDoc, setDocxEditorDoc] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [violationDoc, setViolationDoc] = useState(null); // modal vi phạm

  /* Search / Filter / Sort */
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL"); // ALL | VIOLATION | SAFE
  const [sortKey, setSortKey] = useState("date_desc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const fileInputRef = useRef();
  const sortMenuRef = useRef();

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
    if (!token) {
      setLoading(false);
      return;
    }
    fetchAll();
  }, [subjectId]);

  useEffect(() => {
    const handler = (e) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target))
        setShowSortMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ══ Filter + Sort ══ */
  const violationCount = useMemo(
    () => docs.filter((d) => d.hasViolation).length,
    [docs],
  );

  const filteredDocs = useMemo(() => {
    let result = [...docs];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((d) => d.fileName.toLowerCase().includes(q));
    }

    if (typeFilter !== "ALL")
      result = result.filter((d) => d.fileType === typeFilter);

    if (riskFilter === "VIOLATION")
      result = result.filter((d) => d.hasViolation === true);
    else if (riskFilter === "SAFE")
      result = result.filter((d) => !d.hasViolation);

    result.sort((a, b) => {
      switch (sortKey) {
        case "date_desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date_asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "edited_desc": {
          const ta = new Date(a.lastEditedAt || a.updatedAt || a.createdAt);
          const tb = new Date(b.lastEditedAt || b.updatedAt || b.createdAt);
          return tb - ta;
        }
        case "name_asc":
          return a.fileName.localeCompare(b.fileName, "vi");
        case "name_desc":
          return b.fileName.localeCompare(a.fileName, "vi");
        case "violation":
          // Vi phạm lên trước, rồi theo risk level
          if (a.hasViolation !== b.hasViolation) return a.hasViolation ? -1 : 1;
          const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3, SAFE: 4 };
          return (
            (riskOrder[a.moderationRiskLevel] ?? 4) -
            (riskOrder[b.moderationRiskLevel] ?? 4)
          );
        default:
          return 0;
      }
    });

    return result;
  }, [docs, search, typeFilter, riskFilter, sortKey]);

  /* ── Toast ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
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
      // Giai đoạn 1: upload
      setChecking(false);
      const result = await uploadDocument(subjectId, file);

      // Giai đoạn 2: kiểm duyệt (BE đã làm, chỉ hiển thị spinner ngắn)
      setUploading(false);
      setChecking(true);
      await new Promise((r) => setTimeout(r, 800)); // UX delay nhỏ

      // Xử lý kết quả kiểm duyệt
      if (result.hasViolation) {
        const riskLabel =
          {
            HIGH: "🔴 Cao",
            MEDIUM: "🟡 Trung bình",
            LOW: "🟢 Thấp",
          }[result.moderationRiskLevel] ?? result.moderationRiskLevel;

        showToast(
          `⚠️ Tài liệu được upload nhưng phát hiện nội dung vi phạm (mức ${riskLabel})`,
          "warning",
        );
      } else {
        showToast("✅ Upload thành công! Nội dung an toàn.");
      }

      await fetchAll();
    } catch {
      showToast("Upload thất bại, thử lại!", "error");
    } finally {
      setUploading(false);
      setChecking(false);
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
      setDocs((prev) =>
        prev.map((d) => (d.documentId === updated.documentId ? updated : d)),
      );
    } catch {}
    try {
      await openFile(subjectId, doc.documentId);
    } catch {
      showToast("Không thể mở file!", "error");
    }
  };

  /* ── Edit / Delete / Create ── */
  const handleOpenEdit = (doc) => {
    if (doc?.fileName) setDocxEditorDoc(doc);
  };
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

  const currentSort = SORT_OPTIONS.find((s) => s.key === sortKey);
  const isProcessing = uploading || checking;

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
          {/* ✅ Stat card vi phạm — chỉ hiện khi có */}
          {violationCount > 0 && (
            <div
              className="dt-stat-card"
              style={{ cursor: "pointer", borderColor: "#fed7aa" }}
              onClick={() =>
                setRiskFilter(riskFilter === "VIOLATION" ? "ALL" : "VIOLATION")
              }
              title="Click để lọc tài liệu vi phạm"
            >
              <div className="dt-stat-icon orange">⚠️</div>
              <div className="dt-stat-info">
                <div className="dt-stat-num" style={{ color: "#ea580c" }}>
                  {violationCount}
                </div>
                <div className="dt-stat-label">Vi phạm</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Action bar ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Tạo tài liệu trống
        </button>
      </div>

      {/* ── Upload zone ── */}
      <div
        className={`dt-upload-zone ${dragOver ? "drag-over" : ""} ${checking ? "dt-upload-zone--checking" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          disabled={isProcessing}
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />

        <div className="dt-upload-icon">
          {checking ? (
            <ShieldAlert size={18} color="#fb923c" />
          ) : (
            <Upload size={18} />
          )}
        </div>

        {uploading ? (
          <>
            <div className="dt-upload-title">Đang upload...</div>
            <div className="dt-upload-progress">
              <div
                className="dt-upload-progress-bar"
                style={{ width: "70%" }}
              />
            </div>
          </>
        ) : checking ? (
          <div className="dt-upload-checking">
            <div className="dt-upload-checking-spinner" />
            <div className="dt-upload-checking-text">
              🛡️ AI đang kiểm duyệt nội dung...
            </div>
          </div>
        ) : (
          <>
            <div className="dt-upload-title">
              Kéo thả file vào đây hoặc <span>chọn file</span>
            </div>
            <div className="dt-upload-hint">
              Hỗ trợ PDF, DOCX • Tối đa 50MB • Nội dung được kiểm duyệt tự động
            </div>
          </>
        )}
      </div>

      {/* ══ Toolbar: Search + Filter + Sort ══ */}
      <div className="dt-toolbar">
        {/* Tìm kiếm */}
        <div className="dt-search-wrap">
          <span className="dt-search-icon">
            <Search size={14} />
          </span>
          <input
            className="dt-search-input"
            placeholder="Tìm kiếm tên file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="dt-search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        {/* Lọc theo loại file */}
        <select
          className="dt-filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">Tất cả loại</option>
          <option value="PDF">📕 PDF</option>
          <option value="DOCX">📘 DOCX</option>
        </select>

        {/* ✅ Lọc theo vi phạm */}
        <select
          className="dt-filter-select"
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          style={
            riskFilter === "VIOLATION"
              ? {
                  borderColor: "#fb923c",
                  color: "#ea580c",
                  background: "#fff7ed",
                }
              : {}
          }
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="SAFE">✅ An toàn</option>
          <option value="VIOLATION">⚠️ Vi phạm ({violationCount})</option>
        </select>

        {/* Sắp xếp */}
        <div style={{ position: "relative" }} ref={sortMenuRef}>
          <button
            className={`dt-sort-btn ${showSortMenu ? "active" : ""}`}
            onClick={() => setShowSortMenu((v) => !v)}
          >
            <ArrowUpDown size={13} />
            {currentSort?.label}
          </button>

          {showSortMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                zIndex: 100,
                minWidth: 200,
                overflow: "hidden",
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setSortKey(opt.key);
                    setShowSortMenu(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "9px 14px",
                    background: sortKey === opt.key ? "#f0fdf4" : "transparent",
                    color: sortKey === opt.key ? "#22c55e" : "#374151",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: sortKey === opt.key ? 600 : 400,
                    textAlign: "left",
                    transition: "background 0.12s",
                  }}
                  onMouseOver={(e) => {
                    if (sortKey !== opt.key)
                      e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseOut={(e) => {
                    if (sortKey !== opt.key)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {opt.icon}
                  {opt.label}
                  {sortKey === opt.key && (
                    <span style={{ marginLeft: "auto", color: "#22c55e" }}>
                      ✓
                    </span>
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
          {(search || typeFilter !== "ALL" || riskFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
                setRiskFilter("ALL");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: 11,
                cursor: "pointer",
                textDecoration: "underline",
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
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
                setRiskFilter("ALL");
              }}
              style={{
                marginTop: 8,
                background: "none",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                padding: "4px 12px",
                fontSize: 11,
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.documentId}
              className={`dt-doc-card ${doc.hasViolation ? "dt-doc-card--violation" : ""}`}
            >
              <FileIcon type={doc.fileType} />

              <div className="dt-doc-info">
                <div className="dt-doc-name">{doc.fileName}</div>

                <div className="dt-doc-meta">
                  <span>{doc.fileType}</span>
                  <span>•</span>
                  <span>{formatDate(doc.createdAt)}</span>
                  {doc.lastEditedAt && (
                    <>
                      <span>•</span>
                      <span style={{ color: "#22c55e" }}>
                        Sửa: {formatDate(doc.lastEditedAt)}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <StatusBadge status={doc.status} />

                  {/* ✅ Risk badge nhỏ trong meta */}
                  {doc.hasViolation && (
                    <RiskBadge level={doc.moderationRiskLevel} />
                  )}
                </div>

                {/* ✅ Banner cảnh báo mở rộng — click để xem chi tiết */}
                {doc.hasViolation && (
                  <div
                    className="dt-violation-banner"
                    onClick={() => setViolationDoc(doc)}
                    style={{ cursor: "pointer" }}
                    title="Click để xem chi tiết vi phạm"
                  >
                    <span className="dt-violation-banner-icon">⚠️</span>
                    <div className="dt-violation-banner-text">
                      <div className="dt-violation-banner-summary">
                        {doc.moderationSummary || "Phát hiện nội dung vi phạm"}
                      </div>
                      {doc.moderationWarning && (
                        <div className="dt-violation-banner-warning">
                          {doc.moderationWarning} —{" "}
                          <span
                            style={{
                              textDecoration: "underline",
                              color: "#c2410c",
                            }}
                          >
                            Xem chi tiết
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="dt-doc-actions">
                {/* Nút xem chi tiết vi phạm */}
                {doc.hasViolation && (
                  <button
                    className="dt-action-btn"
                    title="Xem chi tiết vi phạm"
                    onClick={() => setViolationDoc(doc)}
                    style={{ color: "#fb923c", background: "#fff7ed" }}
                  >
                    <AlertTriangle size={14} />
                  </button>
                )}

                <button
                  className="dt-action-btn view"
                  title="Xem tài liệu"
                  onClick={() => handleView(doc)}
                >
                  <Eye size={14} />
                </button>

                {doc.fileType === "DOCX" && (
                  <button
                    className="dt-action-btn edit"
                    title="Chỉnh sửa"
                    onClick={() => handleOpenEdit(doc)}
                  >
                    <Edit2 size={14} />
                  </button>
                )}

                <button
                  className="dt-action-btn delete"
                  title="Xóa"
                  onClick={() => handleDelete(doc)}
                >
                  <Trash2 size={14} />
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
            setDocs((prev) =>
              prev.map((d) =>
                d.documentId === updated.documentId ? updated : d,
              ),
            );
            setDocxEditorDoc(null);
            showToast("Lưu thành công!");
          }}
        />
      )}

      {/* ✅ Modal chi tiết vi phạm */}
      {violationDoc && (
        <ViolationModal
          doc={violationDoc}
          onClose={() => setViolationDoc(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && <div className={`dt-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
