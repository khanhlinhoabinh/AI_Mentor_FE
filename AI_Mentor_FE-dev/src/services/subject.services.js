import api from "../configs/axios.config";

// GET ALL SUBJECTS
export const getSubjects = async () => {
  const response = await api.get("/subjects");
  return response.data;
};