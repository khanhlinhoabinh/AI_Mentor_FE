import axiosInstance from "../configs/axios.config";

// TODO: Replace BASE_URL with your actual backend URL if not using axiosInstance
// e.g. const BASE_URL = "http://localhost:8080/api";

/**
 * Get all conversations for a user
 * GET /api/conversations/user/{userId}
 * NOTE: Backend endpoint not yet implemented — add when ready
 */
export const getChatSessions = async (userId) => {
  // TODO: Implement backend: GET /api/conversations/user/{userId}
  // Returns: [{ conversationId, title, createdAt }, ...]
  const response = await axiosInstance.get(`/api/conversations/user/${userId}`);
  return response.data;
};

/**
 * Get all messages for a conversation
 * GET /api/conversations/{conversationId}/messages
 * NOTE: Backend endpoint not yet implemented — add when ready
 */
export const getMessages = async (conversationId) => {
  // TODO: Implement backend: GET /api/conversations/{conversationId}/messages
  // Returns: [{ messageId, sender, content, createdAt }, ...]
  const response = await axiosInstance.get(`/api/conversations/${conversationId}/messages`);
  return response.data;
};

/**
 * Delete a conversation
 * DELETE /api/conversations/{conversationId}
 * NOTE: Backend endpoint not yet implemented — add when ready
 */
export const deleteSession = async (conversationId) => {
  // TODO: Implement backend: DELETE /api/conversations/{conversationId}
  const response = await axiosInstance.delete(`/api/conversations/${conversationId}`);
  return response.data;
};

/**
 * Create a new conversation
 * POST /api/conversations/{userId}
 * Body: { title: string }
 * Returns: { conversationId: Long }
 */
export const createSession = async (userId, title = "Cuộc hội thoại mới") => {
  const response = await axiosInstance.post(`/api/conversations/${userId}`, { title });
  return response.data; // { conversationId }
};

/**
 * Send a message in a conversation
 * POST /api/chat/{conversationId}
 * Body: { message: string }
 * Returns: { response: string }
 */
export const sendMessage = async (conversationId, message) => {
  const response = await axiosInstance.post(`/api/chat/${conversationId}`, { message });
  return response.data; // { response: string }
};