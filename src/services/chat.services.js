import axiosInstance from "../configs/axios.config";

/**
 * Lấy danh sách cuộc hội thoại của user
 * GET /api/conversations/user/{userId}
 */
export const getChatSessions = async (userId) => {
  const response = await axiosInstance.get(
    `/conversations/user/${userId}`
  );

  return response.data;
};

/**
 * Lấy toàn bộ tin nhắn của 1 cuộc hội thoại
 * GET /api/conversations/{conversationId}/messages
 */
export const getMessages = async (conversationId) => {
  const response = await axiosInstance.get(
    `/conversations/${conversationId}/messages`
  );

  return response.data;
};

/**
 * Xóa cuộc hội thoại
 * DELETE /api/conversations/{conversationId}
 */
export const deleteSession = async (conversationId) => {
  const response = await axiosInstance.delete(
    `/conversations/${conversationId}`
  );

  return response.data;
};

/**
 * Tạo cuộc hội thoại mới
 * POST /api/conversations/{userId}
 *
 * body:
 * {
 *   title: string
 * }
 */
export const createSession = async (
  userId,
  title = "Cuộc hội thoại mới"
) => {
  const response = await axiosInstance.post(
    `/conversations/${userId}`,
    {
      title,
    }
  );

  return response.data;
};

/**
 * Gửi tin nhắn tới AI
 * POST /api/chat/{conversationId}
 *
 * body:
 * {
 *   message: string
 * }
 */
export const sendMessage = async (
  conversationId,
  message
) => {
  const response = await axiosInstance.post(
    `/chat/${conversationId}`,
    {
      message,
    }
  );

  return response.data;
};