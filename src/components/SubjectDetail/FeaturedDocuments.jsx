import { MoreVertical } from "lucide-react";
import "./FeaturedDocuments.css";

const FILE_COLORS = {
  PDF:  { bg: "#fee2e2", color: "#ef4444", label: "PDF" },
  DOCX: { bg: "#dbeafe", color: "#3b82f6", label: "DOC" },
};

const STATUS_LABEL = {
  UPLOADED: { label: "Mới upload",     color: "#f97316" },
  SEEN:     { label: "Đã xem",         color: "#22c55e" },
  EDITED:   { label: "Đã chỉnh sửa",   color: "#3b82f6" },
};

function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export default function FeaturedDocuments({ documents, loading, onViewAll }) {
  return (
    <section className="fd-section">
      <div className="fd-header">
        <h2 className="fd-title">Tài liệu gần đây</h2>
        <button className="fd-view-all" onClick={onViewAll}>
          Xem tất cả
        </button>
      </div>

      {loading ? (
        <div className="fd-empty">Đang tải tài liệu...</div>
      ) : documents.length === 0 ? (
        <div className="fd-empty">Chưa có tài liệu nào trong môn học này.</div>
      ) : (
        <div className="fd-grid">
          {documents.map((doc) => {
            const meta = FILE_COLORS[doc.fileType] || FILE_COLORS.PDF;
            const statusMeta = STATUS_LABEL[doc.status] || STATUS_LABEL.UPLOADED;

            return (
              <div className="fd-card" key={doc.documentId}>
                <div className="fd-card-top">
                  <div className="fd-icon" style={{ background: meta.bg, color: meta.color }}>
                    {meta.label}
                  </div>
                  <button className="fd-more"><MoreVertical size={15} /></button>
                </div>
                <div className="fd-name">{doc.fileName}</div>
                <div className="fd-meta">
                  {doc.fileType} • {formatDate(doc.createdAt)}
                </div>
                <div className="fd-status" style={{ color: statusMeta.color }}>
                  ● {statusMeta.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}