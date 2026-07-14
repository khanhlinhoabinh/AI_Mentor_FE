import api from "../configs/axios.config";

export const getRoadmaps = async () => {
  const response = await api.get("/roadmaps");
  return response.data;
};

export const getRoadmapById = async (roadmapId) => {
  const response = await api.get(`/roadmaps/${roadmapId}`);
  return response.data;
};

export const createRoadmap = async (data) => {
  const response = await api.post("/roadmaps", data);
  return response.data;
};

export const updateRoadmap = async (roadmapId, data) => {
  const response = await api.put(`/roadmaps/${roadmapId}`, data);
  return response.data;
};

export const deleteRoadmap = async (roadmapId) => {
  const response = await api.delete(`/roadmaps/${roadmapId}`);
  return response.data;
};

export const startRoadmap = async (roadmapId) => {
  const response = await api.post(`/roadmaps/${roadmapId}/start`);
  return response.data;
};