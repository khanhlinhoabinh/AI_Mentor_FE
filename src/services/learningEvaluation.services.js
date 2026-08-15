import api from "../configs/axios.config";

// Đánh giá hoạt động học tập trong N ngày gần nhất (mặc định 7 ngày = theo tuần)
export const getWeeklyEvaluation = async (days = 7) => {
  const response = await api.get(`/learning-evaluation/weekly?days=${days}`);
  return response.data;
};