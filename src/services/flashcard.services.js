import api from "../configs/axios.config";

// ========================= FLASHCARD SET =========================

/**
 * Tạo flashcard set mới
 * POST /api/flashcard-sets
 * body: { subjectId, setName, description }
 */
export const createFlashcardSet = (data) => {
  return api.post("/flashcard-sets", data);
};

/**
 * Lấy danh sách tất cả flashcard set của user hiện tại
 * GET /api/flashcard-sets
 */
export const getFlashcardSets = () => {
  return api.get("/flashcard-sets");
};

/**
 * Lấy chi tiết 1 flashcard set (không kèm cards)
 * GET /api/flashcard-sets/{id}
 */
export const getFlashcardSetDetail = (setId) => {
  return api.get(`/flashcard-sets/${setId}`);
};

/**
 * Lấy chi tiết đầy đủ flashcard set kèm danh sách cards
 * GET /api/flashcard-sets/{id}/full
 */
export const getFlashcardSetFull = (setId) => {
  return api.get(`/flashcard-sets/${setId}/full`);
};

/**
 * Cập nhật flashcard set
 * PUT /api/flashcard-sets/{id}
 * body: { subjectId, setName, description }
 */
export const updateFlashcardSet = (setId, data) => {
  return api.put(`/flashcard-sets/${setId}`, data);
};

/**
 * Xóa flashcard set
 * DELETE /api/flashcard-sets/{id}
 */
export const deleteFlashcardSet = (setId) => {
  return api.delete(`/flashcard-sets/${setId}`);
};

/**
 * Tìm kiếm flashcard set theo từ khóa (theo setName)
 * GET /api/flashcard-sets/search?keyword=
 */
export const searchFlashcardSets = (keyword) => {
  return api.get("/flashcard-sets/search", {
    params: { keyword },
  });
};

/**
 * Cập nhật phương thức tạo (sourceType) cho flashcard set
 * PUT /api/flashcard-sets/{id}/source
 * body: { sourceType } // "MANUAL" | "AI"
 */
export const updateFlashcardSourceType = (setId, sourceType) => {
  return api.put(`/flashcard-sets/${setId}/source`, { sourceType });
};

/**
 * Tạo flashcard set bằng AI
 * POST /api/flashcard-sets/generate
 * body: { setName, prompt, numberOfCards, documentId }
 */
export const generateFlashcardSetByAI = (data) => {
  return api.post("/flashcard-sets/generate", data);
};

// ========================= FLASHCARD (CARD) =========================

/**
 * Tạo flashcard mới trong 1 set (chỉ áp dụng khi set có sourceType = MANUAL)
 * POST /api/flashcard-sets/{setId}/cards
 * body: { cardType, frontContent, backContent } // cardType: "QA" | "VOCAB"
 */
export const createFlashcard = (setId, data) => {
  return api.post(`/flashcard-sets/${setId}/cards`, data);
};

/**
 * Lấy danh sách flashcard theo set
 * GET /api/flashcard-sets/{setId}/cards
 */
export const getFlashcardsBySet = (setId) => {
  return api.get(`/flashcard-sets/${setId}/cards`);
};

/**
 * Lấy chi tiết 1 flashcard
 * GET /api/flashcards/{cardId}
 */
export const getFlashcardDetail = (cardId) => {
  return api.get(`/flashcards/${cardId}`);
};

/**
 * Cập nhật flashcard
 * PUT /api/flashcards/{cardId}
 * body: { cardType, frontContent, backContent }
 */
export const updateFlashcard = (cardId, data) => {
  return api.put(`/flashcards/${cardId}`, data);
};

/**
 * Xóa flashcard
 * DELETE /api/flashcards/{cardId}
 */
export const deleteFlashcard = (cardId) => {
  return api.delete(`/flashcards/${cardId}`);
};