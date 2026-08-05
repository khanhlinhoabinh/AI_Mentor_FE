import api from "../configs/axios.config";

/**
 * Notification Service
 * Base URL: /api/notifications
 * Khớp với NotificationController.java (backend đã có thật)
 */

const BASE_URL = "/notifications";

export const getMyNotifications = async () => {
  return api.get(BASE_URL);
};

export const getUnreadNotifications = async () => {
  return api.get(`${BASE_URL}/unread`);
};

export const countUnreadNotifications = async () => {
  return api.get(`${BASE_URL}/count`);
};

export const markNotificationAsRead = async (id) => {
  return api.put(`${BASE_URL}/${id}/read`);
};

export const markAllNotificationsAsRead = async () => {
  return api.put(`${BASE_URL}/read-all`);
};

/**
 * Gửi phản hồi cảm xúc (😊 / ☹️) để nhận lời động viên từ AI
 * @param {string} id - notificationId
 * @param {"HAPPY"|"SAD"} mood
 */
export const sendMoodFeedback = async (id, mood) => {
  return api.post(`${BASE_URL}/${id}/feedback`, { mood });
};

// Lấy tất cả notification
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

// Đếm notification chưa đọc
export const countUnread = async () => {
  const response = await api.get("/notifications/count");
  return response.data;
};

// Đánh dấu đã đọc 1 notification
export const markAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

// Đánh dấu đọc tất cả
export const markAllAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};
