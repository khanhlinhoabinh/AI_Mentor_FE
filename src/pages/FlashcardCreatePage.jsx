import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import {
  createFlashcardSet,
  generateFlashcardSetByAI,
} from "../services/flashcard.services";
import { getSubjects } from "../services/subject.services";
import { getDocumentsBySubject } from "../services/document.services";
import "../styles/FlashcardEditPage.css";

const TABS = [
  { id: "manual", label: "Tạo thủ công" },
  { id: "ai", label: "Tạo bằng AI" },
];

const FlashcardCreatePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manual");

  // ─── Subjects (dùng chung cho cả 2 tab) ─────────────────────────────────
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [subjectId, setSubjectId] = useState("");

  // ─── Manual tab state ────────────────────────────────────────────────────
  const [setName, setSetName] = useState("");
  const [description, setDescription] = useState("");
  const [creatingManual, setCreatingManual] = useState(false);

  // ─── AI tab state ────────────────────────────────────────────────────────
  const [aiSetName, setAiSetName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [numberOfCards, setNumberOfCards] = useState(10);
  const [documentId, setDocumentId] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState(null);

  // ─── Load subjects khi mount ─────────────────────────────────────────────
  useEffect(() => {
    const loadSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const data = await getSubjects();
        setSubjects(data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải danh sách môn học."
        );
      } finally {
        setLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);

  // ─── Load documents khi subjectId thay đổi (chỉ cần cho tab AI) ─────────
  useEffect(() => {
    if (!subjectId) {
      setDocuments([]);
      setDocumentId("");
      return;
    }

    const loadDocuments = async () => {
      setLoadingDocuments(true);
      try {
        const docs = await getDocumentsBySubject(subjectId);
        setDocuments(docs || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải danh sách tài liệu."
        );
      } finally {
        setLoadingDocuments(false);
      }
    };

    loadDocuments();
  }, [subjectId]);

  // ─── Manual submit ───────────────────────────────────────────────────────
  const canSubmitManual = setName.trim().length > 0 && !creatingManual;

  const handleSubmitManual = useCallback(async () => {
    if (!canSubmitManual) return;

    setCreatingManual(true);
    setError(null);

    try {
      const res = await createFlashcardSet({
        subjectId: subjectId ? Number(subjectId) : null,
        setName: setName.trim(),
        description: description.trim(),
      });

      const newSetId = res.data.flashcardSetId;
      navigate(`/flashcard-sets/${newSetId}/edit`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tạo bộ flashcard."
      );
      setCreatingManual(false);
    }
  }, [canSubmitManual, subjectId, setName, description, navigate]);

  // ─── AI submit ───────────────────────────────────────────────────────────
  const canSubmitAi =
    aiSetName.trim().length > 0 &&
    prompt.trim().length > 0 &&
    numberOfCards > 0 &&
    !generating;

  const handleSubmitAi = useCallback(async () => {
    if (!canSubmitAi) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await generateFlashcardSetByAI({
        setName: aiSetName.trim(),
        prompt: prompt.trim(),
        numberOfCards: Number(numberOfCards),
        documentId: documentId ? Number(documentId) : null,
      });

      const newSetId = res.data.flashcardSetId;
      navigate(`/flashcard-sets/${newSetId}/edit`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tạo flashcard bằng AI."
      );
      setGenerating(false);
    }
  }, [canSubmitAi, aiSetName, prompt, numberOfCards, documentId, navigate]);

  return (
    <div className="flashcard-layout">
      <Header />
      <div className="flashcard-layout__body">
        <Sidebar />
        <main className="flashcard-layout__main">
          <div className="flashcard-page">

            <div className="flashcard-page__header">
              <div className="flashcard-page__header-left">
                <div className="flashcard-page__header-icon">✨</div>
                <div>
                  <h1 className="flashcard-page__title">Tạo Flashcard</h1>
                  <p className="flashcard-page__subtitle">
                    Tạo thủ công hoặc để AI tạo giúp bạn
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flashcard-page__error" role="alert">
                {error}
              </div>
            )}

            <div className="flashcard-page__content">
              <div className="flashcard-page__left">
                <div className="flashcard-page__card">

                  {/* Tabs */}
                  <div className="edit-form__tabs">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`edit-form__tab ${activeTab === tab.id ? "edit-form__tab--active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Subject (dùng chung) */}
                  <div className="edit-form__field">
                    <div className="edit-form__field-header">
                      <label className="edit-form__label">Môn học</label>
                    </div>
                    <div className="edit-form__select-wrapper">
                      <select
                        className="edit-form__select"
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        disabled={loadingSubjects}
                      >
                        <option value="">-- Không chọn môn học --</option>
                        {subjects.map((subject) => (
                          <option key={subject.subjectId} value={subject.subjectId}>
                            {subject.subjectName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ─── TAB: Tạo thủ công ─── */}
                  {activeTab === "manual" && (
                    <>
                      <div className="edit-form__field">
                        <div className="edit-form__field-header">
                          <label className="edit-form__label">Tên bộ Flashcard</label>
                        </div>
                        <textarea
                          className="edit-form__textarea"
                          value={setName}
                          onChange={(e) => setSetName(e.target.value)}
                          placeholder="Ví dụ: Cấu trúc dữ liệu và giải thuật"
                          rows={2}
                        />
                      </div>

                      <div className="edit-form__field">
                        <div className="edit-form__field-header">
                          <label className="edit-form__label">Mô tả (không bắt buộc)</label>
                        </div>
                        <textarea
                          className="edit-form__textarea"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Mô tả ngắn về bộ flashcard này..."
                          rows={2}
                        />
                      </div>

                      <div className="edit-form__actions">
                        <div className="edit-form__actions-left" />
                        <div className="edit-form__actions-right">
                          <button
                            type="button"
                            className="edit-form__btn-save"
                            onClick={handleSubmitManual}
                            disabled={!canSubmitManual}
                          >
                            {creatingManual ? "Đang tạo..." : "Bắt đầu tạo Flashcard"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ─── TAB: Tạo bằng AI ─── */}
                  {activeTab === "ai" && (
                    <>
                      <div className="edit-form__field">
                        <div className="edit-form__field-header">
                          <label className="edit-form__label">Tên bộ Flashcard</label>
                        </div>
                        <textarea
                          className="edit-form__textarea"
                          value={aiSetName}
                          onChange={(e) => setAiSetName(e.target.value)}
                          placeholder="Ví dụ: Từ vựng tiếng Anh chủ đề du lịch"
                          rows={2}
                        />
                      </div>

                      <div className="edit-form__field">
                        <div className="edit-form__field-header">
                          <label className="edit-form__label">Yêu cầu cho AI (prompt)</label>
                        </div>
                        <textarea
                          className="edit-form__textarea edit-form__textarea--answer"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Mô tả nội dung bạn muốn AI tạo flashcard, ví dụ: Tạo flashcard về các thuật ngữ cơ bản trong cấu trúc dữ liệu..."
                          rows={4}
                        />
                      </div>

                      <div className="edit-form__row">
                        <div className="edit-form__field">
                          <div className="edit-form__field-header">
                            <label className="edit-form__label">Số lượng thẻ</label>
                          </div>
                          <input
                            type="number"
                            className="edit-form__textarea"
                            min={1}
                            max={50}
                            value={numberOfCards}
                            onChange={(e) => setNumberOfCards(e.target.value)}
                          />
                        </div>

                        <div className="edit-form__field">
                          <div className="edit-form__field-header">
                            <label className="edit-form__label">Tài liệu nguồn (không bắt buộc)</label>
                          </div>
                          <div className="edit-form__select-wrapper">
                            <select
                              className="edit-form__select"
                              value={documentId}
                              onChange={(e) => setDocumentId(e.target.value)}
                              disabled={!subjectId || loadingDocuments}
                            >
                              <option value="">-- Không dùng tài liệu --</option>
                              {documents.map((doc) => (
                                <option key={doc.documentId} value={doc.documentId}>
                                  {doc.fileName}
                                </option>
                              ))}
                            </select>
                          </div>
                          {!subjectId && (
                            <span className="edit-form__counter">
                              Chọn môn học để xem tài liệu
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="edit-form__actions">
                        <div className="edit-form__actions-left" />
                        <div className="edit-form__actions-right">
                          <button
                            type="button"
                            className="edit-form__btn-save"
                            onClick={handleSubmitAi}
                            disabled={!canSubmitAi}
                          >
                            {generating ? "AI đang tạo flashcard..." : "Tạo bằng AI"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default FlashcardCreatePage;