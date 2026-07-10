import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { getQuizSets, deleteQuizSet } from "../services/quiz.services";
import { getSubjects } from "../services/subject.services";
import "../styles/QuizListPage.css";

const DIFFICULTY_MAP = {
  EASY: { label: "Dễ", color: "#10b981", bg: "#ecfdf5" },
  MEDIUM: { label: "Trung bình", color: "#f59e0b", bg: "#fffbeb" },
  HARD: { label: "Khó", color: "#ef4444", bg: "#fef2f2" },
};

const TYPE_MAP = {
  MULTIPLE_CHOICE: "Trắc nghiệm",
  TRUE_FALSE: "Đúng / Sai",
};

function formatTime(seconds) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  return `${m} phút`;
}

export default function QuizListPage() {
  const navigate = useNavigate();
  const [quizSets, setQuizSets] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSub, setFilterSub] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadQuizSets();
  }, [filterSub]);

  const loadData = async () => {
    try {
      const [sets, subs] = await Promise.all([getQuizSets(), getSubjects()]);
      setQuizSets(sets);
      setSubjects(subs);
    } catch (e) {
      showToast("Không thể tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadQuizSets = async () => {
    try {
      const sets = await getQuizSets(filterSub || null);
      setQuizSets(sets);
    } catch (e) {
      showToast("Không thể tải danh sách", "error");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa bộ quiz "${title}"? Tất cả câu hỏi sẽ bị xóa.`))
      return;
    setDeleting(id);
    try {
      await deleteQuizSet(id);
      setQuizSets((prev) => prev.filter((q) => q.id !== id));
      showToast("Đã xóa bộ quiz");
    } catch {
      showToast("Xóa thất bại", "error");
    } finally {
      setDeleting(null);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="ql-layout">
      <Sidebar />
      <div className="ql-main">
        <Header />
        <div className="ql-body">
          {/* Top bar */}
          <div className="ql-topbar">
            <div className="ql-topbar-left">
              <div className="ql-title-icon">🎯</div>
              <div>
                <h1 className="ql-title">Bộ Quiz của tôi</h1>
                <p className="ql-subtitle">Quản lý và làm bài kiểm tra</p>
              </div>
            </div>
            <button
              className="ql-create-btn"
              onClick={() => navigate("/quiz/create")}
            >
              + Tạo Quiz mới
            </button>
          </div>

          {/* Filter */}
          <div className="ql-filter-bar">
            <select
              className="ql-filter-select"
              value={filterSub}
              onChange={(e) => setFilterSub(e.target.value)}
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>
                  {s.subjectName}
                </option>
              ))}
            </select>
            <span className="ql-count">{quizSets.length} bộ quiz</span>
          </div>

          {/* List */}
          {loading ? (
            <div className="ql-loading">Đang tải...</div>
          ) : quizSets.length === 0 ? (
            <div className="ql-empty">
              <div className="ql-empty-icon">📝</div>
              <div className="ql-empty-title">Chưa có bộ quiz nào</div>
              <div className="ql-empty-sub">
                Tạo bộ quiz đầu tiên để bắt đầu luyện tập
              </div>
              <button
                className="ql-create-btn"
                onClick={() => navigate("/quiz/create")}
              >
                + Tạo Quiz mới
              </button>
            </div>
          ) : (
            <div className="ql-grid">
              {quizSets.map((q) => {
                const diff =
                  DIFFICULTY_MAP[q.difficulty] ?? DIFFICULTY_MAP.MEDIUM;
                const type = TYPE_MAP[q.questionType] ?? q.questionType;
                const last = q.lastAttempt;
                return (
                  <div key={q.id} className="ql-card">
                    <div className="ql-card-top">
                      <div className="ql-card-title-row">
                        <h3 className="ql-card-title">{q.title}</h3>
                        <span
                          className="ql-diff-badge"
                          style={{ color: diff.color, background: diff.bg }}
                        >
                          {diff.label}
                        </span>
                      </div>
                      {q.subjectName && (
                        <span className="ql-card-subject">{q.subjectName}</span>
                      )}
                    </div>

                    <div className="ql-card-meta">
                      <span>📋 {q.actualQuestionCount} câu</span>
                      <span>⏱ {formatTime(q.timeLimitSeconds)}</span>
                      <span>🎯 {type}</span>
                      <span>⭐ {q.pointsPerQuestion} đ/câu</span>
                    </div>

                    {last ? (
                      <div className="ql-last-attempt">
                        <span className="ql-last-label">Lần làm gần nhất:</span>
                        <span className="ql-last-score">
                          {last.correctCount}/{last.totalQuestions} câu đúng —{" "}
                          {last.score} điểm
                        </span>
                      </div>
                    ) : (
                      <div className="ql-last-attempt ql-last-attempt--empty">
                        Chưa làm bài lần nào
                      </div>
                    )}

                    <div className="ql-card-actions">
                      <button
                        className="ql-btn ql-btn-primary"
                        onClick={() => navigate(`/quiz/${q.id}`)}
                        disabled={q.actualQuestionCount === 0}
                      >
                        {q.actualQuestionCount === 0
                          ? "Chưa có câu hỏi"
                          : "▶ Làm bài"}
                      </button>
                      <button
                        className="ql-btn ql-btn-outline"
                        onClick={() => navigate(`/quiz/${q.id}/review`)}
                        disabled={q.actualQuestionCount === 0}
                      >
                        Xem lại
                      </button>
                      <button
                        className="ql-btn ql-btn-danger"
                        onClick={() => handleDelete(q.id, q.title)}
                        disabled={deleting === q.id}
                      >
                        {deleting === q.id ? "..." : "Xóa"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className={`ql-toast ql-toast--${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
