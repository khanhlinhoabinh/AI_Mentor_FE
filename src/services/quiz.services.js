import api from "../configs/axios.config";

// ── Tạo bộ quiz
export const createQuizSet = async (data) => {
  const response = await api.post("/quiz/sets", data);
  return response.data;
};

// ── Lấy danh sách bộ quiz (toàn bộ hoặc theo môn)
export const getQuizSets = async (subjectId = null) => {
  const params = subjectId ? { subjectId } : {};
  const response = await api.get("/quiz/sets", { params });
  return response.data;
};

// ── Xóa bộ quiz
export const deleteQuizSet = async (quizSetId) => {
  const response = await api.delete(`/quiz/sets/${quizSetId}`);
  return response.data;
};

// ── Gen câu hỏi từ TEXT
export const generateFromText = async (quizSetId, sourceText) => {
  const response = await api.post(`/quiz/sets/${quizSetId}/generate/text`, {
    sourceText,
  });
  return response.data;
};

// ── Gen câu hỏi từ FILE PDF
export const generateFromFile = async (quizSetId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post(
    `/quiz/sets/${quizSetId}/generate/file`,
    formData,
  );
  return response.data;
};

// ── Lưu câu hỏi sau khi review
export const saveQuestions = async (quizSetId, questions) => {
  const response = await api.post(`/quiz/sets/${quizSetId}/questions`, {
    questions,
  });
  return response.data;
};

// ── Lấy câu hỏi để làm bài (ẩn đáp án)
export const getQuestions = async (quizSetId) => {
  const response = await api.get(`/quiz/sets/${quizSetId}/questions`);
  return response.data;
};

// ── Lấy câu hỏi để review/edit (hiện đáp án)
export const getQuestionsForReview = async (quizSetId) => {
  const response = await api.get(`/quiz/sets/${quizSetId}/questions/review`);
  return response.data;
};

// ── Nộp bài & tính điểm
export const submitQuiz = async (quizSetId, answers) => {
  const response = await api.post(`/quiz/sets/${quizSetId}/submit`, {
    answers,
  });
  return response.data;
};
