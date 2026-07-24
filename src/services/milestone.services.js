import api from "../configs/axios.config";

export const getMilestonesByTaskId = async (taskId) => {
  const response = await api.get(`/milestones/task/${taskId}`);
  return response.data;
};

export const createMilestone = async (taskId, data) => {
  // data: { milestoneTitle, dueDate }
  const response = await api.post(`/milestones/${taskId}`, data);
  return response.data;
};

// MỚI
export const updateMilestoneStatus = async (milestoneId, status) => {
  const response = await api.patch(`/milestones/${milestoneId}/status`, { status });
  return response.data;
};