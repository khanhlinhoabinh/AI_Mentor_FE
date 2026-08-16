import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../components/layout/Adminlayout";
import {
  getFlaggedDocuments,
  adminDeleteDocument,
} from "../services/document.services";
import styles from "../styles/admin/ContentManagement.module.css";
import { confirmDelete } from "../utils/swal";
const RISK_CONFIG = {
  HIGH: { label: "Cao", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  MEDIUM: {
    label: "Trung bình",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  LOW: { label: "Thấp", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  NONE: {
    label: "An toàn",
    color: "#6b7280",
    bg: "#f8fafc",
    border: "#e2e8f0",
  },
};

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RiskBadge({ level }) {
  const cfg = RISK_CONFIG[level] ?? RISK_CONFIG.NONE;
  const icon =
    { HIGH: "🔴", MEDIUM: "🟡", LOW: "🟢", NONE: "✅" }[level] ?? "⚠️";
  return (
    <span
      className={styles.riskBadge}
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {icon} {cfg.label}
    </span>
  );
}

/* Modal chi tiết vi phạm */
function DetailModal({ doc, onClose, onDelete }) {
  if (!doc) return null;
  const risk = RISK_CONFIG[doc.moderationRiskLevel] ?? RISK_CONFIG.NONE;

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
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>⚠️</div>
            <div>
              <div className={styles.modalTitle}>Chi tiết vi phạm</div>
              <div className={styles.modalSub}>{doc.fileName}</div>
            </div>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Thông tin file */}
          <div className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Thông tin tài liệu</div>
            <div className={styles.modalInfoGrid}>
              <div className={styles.modalInfoRow}>
                <span className={styles.modalInfoLabel}>Môn học:</span>
                <span className={styles.modalInfoVal}>{doc.subjectName}</span>
              </div>
              <div className={styles.modalInfoRow}>
                <span className={styles.modalInfoLabel}>Loại file:</span>
                <span className={styles.modalInfoVal}>{doc.fileType}</span>
              </div>
              <div className={styles.modalInfoRow}>
                <span className={styles.modalInfoLabel}>Upload lúc:</span>
                <span className={styles.modalInfoVal}>
                  {formatDate(doc.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Mức rủi ro */}
          <div className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Mức độ rủi ro</div>
            <div className={styles.riskRow}>
              <div
                className={styles.riskPill}
                style={{
                  color: risk.color,
                  background: risk.bg,
                  border: `1.5px solid ${risk.border}`,
                }}
              >
                {{ HIGH: "🔴", MEDIUM: "🟡", LOW: "🟢" }[
                  doc.moderationRiskLevel
                ] ?? "⚠️"}{" "}
                {risk.label}
              </div>
            </div>
          </div>

          {/* Tóm tắt */}
          {doc.moderationSummary && (
            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>
                Tóm tắt phân tích AI
              </div>
              <div className={styles.summaryBox}>{doc.moderationSummary}</div>
            </div>
          )}

          {/* Cảnh báo */}
          {doc.moderationWarning && (
            <div className={styles.warningBox}>
              <span>⚠️</span>
              <span>{doc.moderationWarning}</span>
            </div>
          )}

          {/* Categories */}
          {cats.length > 0 && (
            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>Loại vi phạm</div>
              <div className={styles.catList}>
                {cats.map((c, i) => (
                  <span key={i} className={styles.catTag}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.btnKeep} onClick={onClose}>
            ✅ Giữ lại tài liệu
          </button>
          <button className={styles.btnDelete} onClick={() => onDelete(doc)}>
            🗑 Xóa tài liệu
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ Main Page ══ */
export default function ContentManagementPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFlaggedDocuments();
      setDocs(data);
    } catch (e) {
      setError("Không thể tải danh sách tài liệu vi phạm");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (doc) => {
    const ok = await confirmDelete(
      "Xóa tài liệu vi phạm?",
      `File "${doc.fileName}" sẽ bị xóa vĩnh viễn.`,
    );
    if (!ok) return;
    setDeleting(doc.documentId);
    try {
      await adminDeleteDocument(doc.subjectId, doc.documentId);
      setDocs((prev) => prev.filter((d) => d.documentId !== doc.documentId));
      setSelected(null);
      showToast("Đã xóa tài liệu vi phạm");
    } catch {
      showToast("Xóa thất bại, thử lại!", "error");
    } finally {
      setDeleting(null);
    }
  };

  // Filter
  const filtered = docs.filter((d) => {
    const matchRisk =
      riskFilter === "ALL" || d.moderationRiskLevel === riskFilter;
    const matchSearch =
      !search.trim() ||
      d.fileName?.toLowerCase().includes(search.toLowerCase()) ||
      d.subjectName?.toLowerCase().includes(search.toLowerCase());
    return matchRisk && matchSearch;
  });

  const counts = {
    ALL: docs.length,
    HIGH: docs.filter((d) => d.moderationRiskLevel === "HIGH").length,
    MEDIUM: docs.filter((d) => d.moderationRiskLevel === "MEDIUM").length,
    LOW: docs.filter((d) => d.moderationRiskLevel === "LOW").length,
  };

  return (
    <AdminLayout>
      <div className={styles.page}>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <div className={styles.pageIcon}>🛡️</div>
            <div>
              <h1 className={styles.pageTitle}>Kiểm duyệt nội dung</h1>
              <p className={styles.pageSub}>
                Quản lý tài liệu vi phạm tiêu chuẩn cộng đồng
              </p>
            </div>
          </div>
          <button className={styles.refreshBtn} onClick={load}>
            🔄 Làm mới
          </button>
        </div>

        {/* Stat cards */}
        <div className={styles.statBar}>
          {[
            {
              key: "ALL",
              label: "Tổng vi phạm",
              icon: "⚠️",
              color: "#f97316",
              bg: "#fff7ed",
            },
            {
              key: "HIGH",
              label: "Rủi ro cao",
              icon: "🔴",
              color: "#dc2626",
              bg: "#fef2f2",
            },
            {
              key: "MEDIUM",
              label: "Rủi ro TB",
              icon: "🟡",
              color: "#d97706",
              bg: "#fffbeb",
            },
            {
              key: "LOW",
              label: "Rủi ro thấp",
              icon: "🟢",
              color: "#16a34a",
              bg: "#f0fdf4",
            },
          ].map((s) => (
            <div
              key={s.key}
              className={`${styles.statCard} ${riskFilter === s.key ? styles.statCardActive : ""}`}
              style={
                riskFilter === s.key
                  ? { borderColor: s.color, background: s.bg }
                  : {}
              }
              onClick={() =>
                setRiskFilter(riskFilter === s.key ? "ALL" : s.key)
              }
            >
              <span className={styles.statIcon}>{s.icon}</span>
              <div>
                <div className={styles.statNum} style={{ color: s.color }}>
                  {counts[s.key]}
                </div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <input
            className={styles.searchInput}
            placeholder="🔍 Tìm theo tên file hoặc môn học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className={styles.resultCount}>
            {filtered.length}/{docs.length} tài liệu
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className={styles.stateBox}>
            <div className={styles.spinner} />
            <span>Đang tải...</span>
          </div>
        ) : error ? (
          <div className={styles.stateBox}>
            <div className={styles.errorIcon}>❌</div>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={load}>
              Thử lại
            </button>
          </div>
        ) : docs.length === 0 ? (
          <div className={styles.stateBox}>
            <div className={styles.emptyIcon}>✅</div>
            <p className={styles.emptyTitle}>Không có tài liệu vi phạm</p>
            <p className={styles.emptySub}>
              Tất cả tài liệu đều tuân thủ tiêu chuẩn cộng đồng
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.stateBox}>
            <div className={styles.emptyIcon}>🔍</div>
            <p>Không tìm thấy kết quả phù hợp</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tài liệu</th>
                  <th>Môn học</th>
                  <th>Loại</th>
                  <th>Mức rủi ro</th>
                  <th>Tóm tắt vi phạm</th>
                  <th>Ngày upload</th>
                  <th style={{ textAlign: "right" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr
                    key={doc.documentId}
                    className={`${styles.tableRow} ${
                      doc.moderationRiskLevel === "HIGH" ? styles.rowHigh : ""
                    }`}
                  >
                    <td>
                      <div className={styles.fileCell}>
                        <div
                          className={`${styles.fileIcon} ${
                            doc.fileType === "PDF"
                              ? styles.fileIconPdf
                              : styles.fileIconDocx
                          }`}
                        >
                          {doc.fileType === "PDF" ? "PDF" : "DOC"}
                        </div>
                        <span className={styles.fileName}>{doc.fileName}</span>
                      </div>
                    </td>
                    <td className={styles.muted}>{doc.subjectName ?? "—"}</td>
                    <td>
                      <span className={styles.typeBadge}>{doc.fileType}</span>
                    </td>
                    <td>
                      <RiskBadge level={doc.moderationRiskLevel} />
                    </td>
                    <td>
                      <span className={styles.summaryCell}>
                        {doc.moderationSummary
                          ? doc.moderationSummary.slice(0, 60) +
                            (doc.moderationSummary.length > 60 ? "..." : "")
                          : "—"}
                      </span>
                    </td>
                    <td className={styles.muted}>
                      {formatDate(doc.createdAt)}
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button
                          className={styles.btnView}
                          onClick={() => setSelected(doc)}
                          title="Xem chi tiết"
                        >
                          🔍 Chi tiết
                        </button>
                        <button
                          className={styles.btnDel}
                          onClick={() => handleDelete(doc)}
                          disabled={deleting === doc.documentId}
                          title="Xóa tài liệu"
                        >
                          {deleting === doc.documentId ? "..." : "🗑"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal chi tiết */}
      {selected && (
        <DetailModal
          doc={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.msg}
        </div>
      )}
    </AdminLayout>
  );
}
