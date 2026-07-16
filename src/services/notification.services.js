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