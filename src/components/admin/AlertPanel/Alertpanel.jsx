import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Alertpanel.module.css";
import { getFlaggedDocuments } from "../../../services/document.services";

const RISK_CONFIG = {
  HIGH: { icon: "🔴", color: "#EF4444", bg: "#FEE2E2", label: "Rủi ro cao" },
  MEDIUM: {
    icon: "🟡",
    color: "#F59E0B",
    bg: "#FEF9C3",
    label: "Rủi ro trung bình",
  },
  LOW: { icon: "🟢", color: "#16A34A", bg: "#DCFCE7", label: "Rủi ro thấp" },
  NONE: { icon: "⚠️", color: "#6B7280", bg: "#F3F4F6", label: "Cần kiểm tra" },
};

function timeAgo(ts) {
  if (!ts) return "";
  const diffM = Math.floor((Date.now() - new Date(ts)) / 60000);
  if (diffM < 1) return "Vừa xong";
  if (diffM < 60) return `${diffM} phút trước`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `${diffH} giờ trước`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} ngày trước`;
}

export default function AlertPanel() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getFlaggedDocuments();
        if (mounted) setDocs(data || []);
      } catch {
        if (mounted) setDocs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sorted = [...docs].sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3 };
    return (
      (order[a.moderationRiskLevel] ?? 3) - (order[b.moderationRiskLevel] ?? 3)
    );
  });
  const topAlerts = sorted.slice(0, 3);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Cảnh báo hệ thống</h3>
        <button
          className={styles.link}
          onClick={() => navigate("/admin/content")}
        >
          Xem tất cả
        </button>
      </div>

      <div className={styles.list}>
        {loading ? (
          <p className={styles.itemSub}>Đang tải...</p>
        ) : topAlerts.length === 0 ? (
          <p className={styles.itemSub}>Không có cảnh báo nào</p>
        ) : (
          topAlerts.map((doc, i) => {
            const cfg =
              RISK_CONFIG[doc.moderationRiskLevel] ?? RISK_CONFIG.NONE;
            return (
              <div
                key={doc.documentId}
                className={`${styles.item} ${i < topAlerts.length - 1 ? styles.itemBorder : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/admin/content")}
              >
                <div
                  className={styles.iconWrap}
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  <span style={{ fontSize: 15 }}>{cfg.icon}</span>
                </div>
                <div className={styles.content}>
                  <p className={styles.itemTitle}>{doc.fileName}</p>
                  <p className={styles.itemSub}>
                    {cfg.label}
                    {doc.subjectName ? ` · ${doc.subjectName}` : ""}
                  </p>
                </div>
                <span className={styles.time}>{timeAgo(doc.createdAt)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
