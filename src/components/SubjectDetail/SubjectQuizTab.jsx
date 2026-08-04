import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Plus, PlayCircle, Clock, Target, Star } from "lucide-react";
import { getQuizSets } from "../../services/quiz.services";
import "./SubjectQuizTab.css";

const DIFFICULTY_MAP = {
  EASY: { label: "Dễ", color: "#16a34a", bg: "#dcfce7" },
  MEDIUM: { label: "Trung bình", color: "#d97706", bg: "#fef3c7" },
  HARD: { label: "Khó", color: "#dc2626", bg: "#fee2e2" },
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

export default function SubjectQuizTab({ subjectId }) {
  const navigate = useNavigate();
  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend đã hỗ trợ filter theo subjectId trực tiếp ở GET /quiz/sets
  const loadQuizSets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sets = await getQuizSets(subjectId);
      setQuizSets(sets || []);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải danh sách quiz.");
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    loadQuizSets();
  }, [loadQuizSets]);

  return (
    <div className="sqt-wrap">
      <div className="sqt-header">
        <div className="sqt-header-left">
          <div className="sqt-header-icon">
            <ClipboardList size={18} />
          </div>
          <div>
            <h3 className="sqt-title">Quiz và Luyện tập</h3>
            <p className="sqt-subtitle">
              {loading
                ? "Đang tải..."
                : `${quizSets.length} bộ quiz được liên kết với môn học`}
            </p>
          </div>
        </div>
        <button className="sqt-create-btn" onClick={() => navigate("/quiz/create")}>
          <Plus size={15} /> Tạo Quiz mới
        </button>
      </div>

      {error && <div className="sqt-error">{error}</div>}

      {loading && (
        <div className="sqt-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="sqt-card sqt-skeleton" />
          ))}
        </div>
      )}

      {!loading && !error && quizSets.length === 0 && (
        <div className="sqt-empty">
          <div className="sqt-empty-icon">📝</div>
          <p className="sqt-empty-title">
            Chưa có bộ quiz nào liên kết với môn học này
          </p>
          <p className="sqt-empty-sub">
            Tạo bộ quiz đầu tiên để luyện tập và kiểm tra kiến thức
          </p>
          <button className="sqt-create-btn" onClick={() => navigate("/quiz/create")}>
            <Plus size={15} /> Tạo Quiz mới
          </button>
        </div>
      )}

      {!loading && !error && quizSets.length > 0 && (
        <div className="sqt-grid">
          {quizSets.map((q) => {
            const diff = DIFFICULTY_MAP[q.difficulty] ?? DIFFICULTY_MAP.MEDIUM;
            const type = TYPE_MAP[q.questionType] ?? q.questionType;
            const last = q.lastAttempt;
            return (
              <div key={q.id} className="sqt-card">
                <div className="sqt-card-top">
                  <div className="sqt-card-icon">
                    <ClipboardList size={20} />
                  </div>
                  <span
                    className="sqt-diff-badge"
                    style={{ color: diff.color, background: diff.bg }}
                  >
                    {diff.label}
                  </span>
                </div>

                <h4 className="sqt-card-name">{q.title}</h4>

                <div className="sqt-card-meta">
                  <span>
                    <Target size={12} /> {q.actualQuestionCount} câu
                  </span>
                  <span>
                    <Clock size={12} /> {formatTime(q.timeLimitSeconds)}
                  </span>
                  <span>
                    <Star size={12} /> {q.pointsPerQuestion} đ/câu
                  </span>
                </div>

                <span className="sqt-type-tag">{type}</span>

                {last ? (
                  <div className="sqt-last-attempt">
                    Lần gần nhất:{" "}
                    <strong>
                      {last.correctCount}/{last.totalQuestions}
                    </strong>{" "}
                    câu đúng — {last.score} điểm
                  </div>
                ) : (
                  <div className="sqt-last-attempt sqt-last-attempt--empty">
                    Chưa làm bài lần nào
                  </div>
                )}

                <button
                  className="sqt-btn sqt-btn-primary"
                  onClick={() => navigate(`/quiz/${q.id}`)}
                  disabled={q.actualQuestionCount === 0}
                >
                  <PlayCircle size={14} />
                  {q.actualQuestionCount === 0 ? "Chưa có câu hỏi" : "Làm bài"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}