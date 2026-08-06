import api from "../configs/axios.config";

/**
 * Reminder Service
 * Base URL: /api/reminders
 *
 * Body chuẩn backend yêu cầu (CreateReminderRequest):
 * { title: string, description?: string, reminderDate: "yyyy-MM-dd" }
 */

const BASE_URL = "/reminders";

export const createReminder = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

export const getMyReminders = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const deleteReminder = async (reminderId) => {
  const response = await api.delete(`${BASE_URL}/${reminderId}`);
  return response.data;
};