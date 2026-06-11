import React, { useState, useCallback, useMemo } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import StepProgress from "../components/flashcard/StepProgress/StepProgress";
import EditFlashcardForm from "../components/flashcard/EditFlashcardForm/EditFlashcardForm";
import FlashcardPreview from "../components/flashcard/FlashcardPreview/FlashcardPreview";
import FlashcardTip from "../components/flashcard/FlashcardTip/FlashcardTip";
import {
  STEPS,
  CURRENT_STEP,
  CATEGORIES,
  DIFFICULTY_LEVELS,
  FLASHCARD_COLORS,
  flashcards as initialFlashcards,
  defaultFormData,
  TABS,
} from "../components/flashcard/mock/flashcardData";
import "../styles/FlashcardEditPage.css";

const FlashcardEditPage = () => {
  // ─── State ───────────────────────────────────────────────────────────
  const [flashcards, setFlashcards] = useState(initialFlashcards);
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [activeTab, setActiveTab] = useState("manual");
  const [newTagInput, setNewTagInput] = useState("");

  // Preview state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Tip
  const [tipVisible, setTipVisible] = useState(true);

  // ─── Form handlers ────────────────────────────────────────────────────
  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddTag = useCallback(
    (tag) => {
      if (!formData.tags.includes(tag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setNewTagInput("");
    },
    [formData.tags]
  );

  const handleRemoveTag = useCallback((tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  const handleSave = useCallback(() => {
    const newCard = {
      id: Date.now(),
      question: formData.question,
      answer: formData.answer,
    };
    setFlashcards((prev) => [...prev, newCard]);
    setFormData({ ...defaultFormData });
  }, [formData]);

  const handleClearAll = useCallback(() => {
    setFlashcards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  // ─── Preview handlers ─────────────────────────────────────────────────
  const handleFlip = useCallback(() => setIsFlipped((f) => !f), []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
    setIsFlipped(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(flashcards.length - 1, i + 1));
    setIsFlipped(false);
  }, [flashcards.length]);

  // ─── Safe index ───────────────────────────────────────────────────────
  const safeIndex = useMemo(
    () => Math.min(currentIndex, Math.max(0, flashcards.length - 1)),
    [currentIndex, flashcards.length]
  );

  return (
    <div className="flashcard-layout">
      <Header />
      <div className="flashcard-layout__body">
        <Sidebar />
        <main className="flashcard-layout__main">
          <div className="flashcard-page">

            {/* Page Header */}
            <div className="flashcard-page__header">
              <div className="flashcard-page__header-left">
                <div className="flashcard-page__header-icon">✨</div>
                <div>
                  <h1 className="flashcard-page__title">Tạo Flashcard</h1>
                  <p className="flashcard-page__subtitle">
                    Biến tài liệu thành những thẻ ghi nhớ thông minh
                  </p>
                </div>
              </div>
              <div className="flashcard-page__header-right">
                <button type="button" className="flashcard-page__btn-guide">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Hướng dẫn
                </button>
                <button type="button" className="flashcard-page__btn-library">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  Thư viện Flashcard
                </button>
              </div>
            </div>

            {/* Step Progress */}
            <div className="flashcard-page__steps">
              <StepProgress steps={STEPS} currentStep={CURRENT_STEP} />
            </div>

            {/* Main Content */}
            <div className="flashcard-page__content">

              {/* Left Column */}
              <div className="flashcard-page__left">
                <div className="flashcard-page__card">
                  <h2 className="flashcard-page__section-title">
                    3.&nbsp; Chỉnh sửa Flashcard
                  </h2>
                  <EditFlashcardForm
                    formData={formData}
                    onFormChange={handleFormChange}
                    tabs={TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    categories={CATEGORIES}
                    difficultyLevels={DIFFICULTY_LEVELS}
                    flashcardColors={FLASHCARD_COLORS}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                    onSave={handleSave}
                    onClearAll={handleClearAll}
                    totalCards={flashcards.length}
                    newTagInput={newTagInput}
                    onNewTagInputChange={setNewTagInput}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flashcard-page__right">
                {flashcards.length > 0 ? (
                  <FlashcardPreview
                    cards={flashcards}
                    currentIndex={safeIndex}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    color={formData.color}
                  />
                ) : (
                  <div className="flashcard-page__empty-preview">
                    <span>Chưa có thẻ nào. Hãy lưu thẻ đầu tiên!</span>
                  </div>
                )}

                {/* Study Mode Button */}
                <button type="button" className="flashcard-page__btn-study">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Xem chế độ học thử
                </button>

                {/* Tip */}
                <FlashcardTip
                  visible={tipVisible}
                  onClose={() => setTipVisible(false)}
                />
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FlashcardEditPage;