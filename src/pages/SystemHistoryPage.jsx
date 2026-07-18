import { useEffect, useRef, useState } from "react";
import AdminLayout from "../components/layout/Adminlayout";
import ActivityLogList from "../components/admin/ActivityLogList/ActivityLogList";
import { getActivityLogs, subscribeToActivityStream } from "../services/admin.services";

/**
 * Lịch sử hệ thống:
 * 1) Load lần đầu qua GET /activity-logs
 * 2) Kết nối realtime qua GET /activity-logs/stream (SSE / EventSource)
 *    Không polling, không refresh — item mới được thêm lên đầu danh sách.
 * 3) SSE được cleanup khi component unmount.
 */
export default function SystemHistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getActivityLogs();
        if (mounted) setLogs(data || []);
      } catch (err) {
        console.error("Không thể tải lịch sử hoạt động:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    cleanupRef.current = subscribeToActivityStream({
      onOpen: () => setConnected(true),
      onError: () => setConnected(false),
      onMessage: (newLog) => {
        setLogs((prev) => [newLog, ...prev]);
      },
    });

    return () => {
      mounted = false;
      cleanupRef.current?.();
    };
  }, []);

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", margin: 0 }}>Lịch sử hệ thống</h2>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 999,
            background: connected ? "#E8F8F1" : "#FEE2E2",
            color: connected ? "#2F8F67" : "#EF4444",
          }}
        >
          {connected ? "● Realtime đang kết nối" : "○ Mất kết nối realtime"}
        </span>
      </div>

      {loading ? (
        <p style={{ color: "#9CA3AF", fontSize: 13 }}>Đang tải lịch sử hoạt động...</p>
      ) : (
        <ActivityLogList logs={logs} />
      )}
    </AdminLayout>
  );
}
