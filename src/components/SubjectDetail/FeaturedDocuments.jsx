import { MoreVertical } from "lucide-react";
import "./FeaturedDocuments.css";

const MAX_DOCS = 5;

const FILE_COLORS = {
  pdf:  { bg: "#fee2e2", color: "#ef4444", label: "PDF" },
  docx: { bg: "#dbeafe", color: "#3b82f6", label: "DOC" },
  pptx: { bg: "#ffedd5", color: "#f97316", label: "PPT" },
  txt:  { bg: "#f1f5f9", color: "#64748b", label: "TXT" },
};

export default function FeaturedDocuments({ documents }) {
  const displayed = documents.slice(0, MAX_DOCS);

  return (
    <section className="fd-section">
      <div className="fd-header">
        <h2 className="fd-title">Tài liệu nổi bật</h2>
        <button className="fd-view-all">Xem tất cả</button>
      </div>

      <div className="fd-grid">
        {displayed.map((doc) => {
          const meta = FILE_COLORS[doc.icon] || FILE_COLORS.txt;
          return (
            <div className="fd-card" key={doc.id}>
              <div className="fd-card-top">
                <div className="fd-icon" style={{ background: meta.bg, color: meta.color }}>
                  {meta.label}
                </div>
                <button className="fd-more"><MoreVertical size={15} /></button>
              </div>
              <div className="fd-name">{doc.name}</div>
              <div className="fd-meta">{doc.size} • {doc.type}</div>
              <div className="fd-progress-bar">
                <div className="fd-progress-fill" style={{ width: `${doc.readPercent}%` }} />
              </div>
              <div className="fd-read-pct">Đã đọc {doc.readPercent}%</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}