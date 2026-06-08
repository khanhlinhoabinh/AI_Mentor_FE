import api from "../configs/axios.config";

// GET ALL SUBJECTS
export const getSubjects = async () => {
  const response = await api.get("/subjects");
  return response.data;
};
// CREATE SUBJECT
export const createSubject = async (subjectData) => {
  const response = await api.post(
    "/subjects",
    subjectData
  );

  return response.data;
};