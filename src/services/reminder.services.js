import api from "../configs/axios.config";

/**
 * Reminder Service
 * Base URL: /api/reminders (đã có ReminderController thật ở backend)
 *
 * Body chuẩn backend yêu cầu (CreateReminderRequest):
 * { title: string, description?: string, reminderDate: "yyyy-MM-dd" }
 */

const BASE_URL = "/reminders";

/**
 * Tạo lịch nhắc nhở mới
 * @param {{ title: string, description?: string, reminderDate: string }} data
 * reminderDate format: "yyyy-MM-dd"
 */
export const createReminder = async (data) => {
  return api.post(BASE_URL, data);
};

/**
 * Lấy danh sách reminder của user hiện tại
 * (chuẩn bị sẵn cho các màn hình khác, chưa dùng ở HomePage)
 */
export const getMyReminders = async () => {
  return api.get(BASE_URL);
};

/**
 * Xoá 1 reminder theo id
 * (chuẩn bị sẵn, chưa dùng ở HomePage)
 */
export const deleteReminder = async (reminderId) => {
  return api.delete(`${BASE_URL}/${reminderId}`);
};