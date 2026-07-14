import api from "../configs/axios.config";

export const getTasksByRoadmapId = async (roadmapId) => {
  const response = await api.get(`/roadmap-tasks/${roadmapId}`);
  return response.data;
};

export const createTask = async (data) => {
  // data: { roadmapId, taskName, taskGoal, startDate, endDate }
  const response = await api.post("/roadmap-tasks", data);
  return response.data;
};

export const updateTask = async (taskId, data) => {
  // data: { taskName, taskGoal, startDate, endDate, status }
  const response = await api.put(`/roadmap-tasks/${taskId}`, data);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/roadmap-tasks/${taskId}`);
  return response.data;
};