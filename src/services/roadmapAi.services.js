import api from "../configs/axios.config";

// Gọi AI gợi ý danh sách giai đoạn cho 1 roadmap — CHỈ trả về gợi ý, chưa lưu vào DB
export const suggestRoadmapStages = async (roadmapId, payload) => {
  // payload: { roadmapTitle, topic, startDate, endDate, description }
  const response = await api.post(`/roadmaps/${roadmapId}/ai-suggest-stages`, payload);
  return response.data;
};