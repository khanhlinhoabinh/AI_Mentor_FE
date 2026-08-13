import api from "../configs/axios.config";

// Lấy thông tin chuỗi + danh hiệu
export const getStreak = async () => {
  const response = await api.get("/streaks");
  return response.data;
};

// Điểm danh hôm nay
export const checkIn = async () => {
  const response = await api.post("/streaks/check-in");
  return response.data;
};

// Bảng xếp hạng — Top 50 chuỗi kỷ lục cao nhất
export const getLeaderboard = async () => {
  const response = await api.get("/streaks/leaderboard");
  return response.data;
};