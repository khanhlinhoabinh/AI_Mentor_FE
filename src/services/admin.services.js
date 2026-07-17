import api from "../configs/axios.config";

/**
 * Toàn bộ API liên quan tới khu vực Admin.
 * Mọi request đều đi qua axios instance dùng chung (configs/axios.config.js)
 * nên JWT sẽ tự động được gắn vào header Authorization.
 */

// ============ DASHBOARD ============

// GET /api/admin/dashboard?days=1|3|7
export const getDashboardStatistics = async (days = 7) => {
  const response = await api.get("/admin/dashboard", { params: { days } });
  return response.data;
};

// GET /api/admin/statistics/users
export const getTotalLoggedUsers = async () => {
  const response = await api.get("/admin/statistics/users");
  return response.data;
};

// GET /api/admin/statistics/documents
export const getTotalDocuments = async () => {
  const response = await api.get("/admin/statistics/documents");
  return response.data;
};

// ============ USERS ============

// GET /api/admin/users
export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// GET /api/admin/users/{id}
export const getUserDetail = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

// PUT /api/admin/users/{id}/lock
export const lockUser = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/lock`);
  return response.data;
};

// PUT /api/admin/users/{id}/unlock
export const unlockUser = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/unlock`);
  return response.data;
};

// GET /api/admin/users/new?days=1|7
export const getNewUsers = async (days = 1) => {
  const response = await api.get("/admin/users/new", { params: { days } });
  return response.data;
};

// ============ ACTIVITY LOGS ============

// GET /api/admin/activity-logs
export const getActivityLogs = async () => {
  const response = await api.get("/admin/activity-logs");
  return response.data;
};

/**
 * Kết nối realtime tới /api/admin/activity-logs/stream (Server Sent Events).
 *
 * LƯU Ý QUAN TRỌNG:
 * EventSource chuẩn của trình duyệt KHÔNG cho phép gắn custom header
 * (Authorization: Bearer ...). Vì backend đang bảo vệ toàn bộ API admin
 * bằng JWT filter nên nếu dùng `new EventSource(url)` trực tiếp, request
 * SSE sẽ không có token và có thể bị chặn (401/403) tuỳ cấu hình
 * SecurityConfig/JwtAuthenticationFilter phía backend.
 *
 * Giải pháp: tự đọc SSE bằng `fetch` + `ReadableStream` (không cần cài
 * thêm package nào), cho phép gắn header Authorization như request thường.
 */
export const subscribeToActivityStream = ({ onMessage, onError, onOpen }) => {
  const token = localStorage.getItem("token");
  const API_BASE_URL = api.defaults.baseURL;
  const url = `${API_BASE_URL}/admin/activity-logs/stream`;

  const controller = new AbortController();
  let cancelled = false;

  const readStream = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`SSE connection failed: ${response.status}`);
      }

      onOpen?.();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (!cancelled) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Mỗi event SSE được ngăn cách bởi 1 dòng trống ("\n\n")
        let boundary;
        while ((boundary = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);

          const dataLines = rawEvent
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trim());

          if (dataLines.length === 0) continue;

          const rawData = dataLines.join("\n");
          try {
            onMessage?.(JSON.parse(rawData));
          } catch {
            // event không phải JSON hợp lệ, bỏ qua
          }
        }
      }
    } catch (err) {
      if (!cancelled) onError?.(err);
    }
  };

  readStream();

  // Trả về hàm cleanup để component gọi trong useEffect return
  return () => {
    cancelled = true;
    controller.abort();
  };
};