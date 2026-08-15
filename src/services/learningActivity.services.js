import api from "../configs/axios.config";

// Ghi nhận 1 phiên ôn flashcard — gọi khi người dùng đóng StudyModal / học xong 1 bộ thẻ
export const recordFlashcardStudy = async ({ flashcardSetId, cardsReviewed, durationSeconds }) => {
  const response = await api.post("/learning-activity/flashcards/study", {
    flashcardSetId,
    cardsReviewed,
    durationSeconds,
  });
  return response.data;
};