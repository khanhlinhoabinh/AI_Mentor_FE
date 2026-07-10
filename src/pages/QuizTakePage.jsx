import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import {
  getQuizSets,
  getQuestions,
  submitQuiz,
} from "../services/quiz.services";
import "../styles/QuizTakePage.css";

export default function QuizTakePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quizSet, setQuizSet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: answerString }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    loadQuiz();
    return () => clearInterval(timerRef.current);
  }, [id]);

  const loadQuiz = async () => {
    try {
      const [sets, qs] = await Promise.all([getQuizSets(), getQuestions(id)]);
      const set = sets.find((s) => String(s.id) === String(id));
      setQuizSet(set);
      setQuestions(qs);
      if (set?.timeLimitSeconds > 0) {
        setTimeLeft(set.timeLimitSeconds);
      }
    } catch {
      alert("Không thể tải bài quiz");
      navigate("/quiz");
    } finally {
      setLoading(false);
    }
  };

  /* Timer */
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft !== null]);

  const formatTimer = (s) => {
    const m = Math.floor(s / 60),
      sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleAnswer = (qId, answer) => {
    setAnswers((p) => ({ ...p, [qId]: answer }));
  };

  const handleSubmit = async (auto = false) => {
    if (!auto && !window.confirm("Nộp bài?")) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const result = await submitQuiz(id, answers);
      navigate(`/quiz/${id}/result`, { state: { result, questions } });
    } catch {
      alert("Nộp bài thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const answered = Object.keys(answers).length;
  const isMultiple = quizSet?.questionType === "MULTIPLE_CHOICE";

  if (loading)
    return (
      <div className="qt-layout">
        <Sidebar />
        <div className="qt-main">
          <Header />
          <div className="qt-loading">Đang tải bài quiz...</div>
        </div>
      </div>
    );

  return (
    <div className="qt-layout">
      <Sidebar />
      <div className="qt-main">
        <Header />
        <div className="qt-body">
          {/* Quiz header */}
          <div className="qt-quiz-header">
            <div>
              <h1 className="qt-quiz-title">{quizSet?.title}</h1>
              <p className="qt-quiz-meta">
                {questions.length} câu • {quizSet?.pointsPerQuestion} điểm/câu
                {quizSet?.shuffle && " • Câu hỏi được xáo trộn"}
              </p>
            </div>
            <div className="qt-quiz-header-right">
              {timeLeft !== null && (
                <div
                  className={`qt-timer ${timeLeft < 60 ? "qt-timer--danger" : ""}`}
                >
                  ⏱ {formatTimer(timeLeft)}
                </div>
              )}
              <div className="qt-progress-text">
                {answered}/{questions.length} đã trả lời
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="qt-progress-bar">
            <div
              className="qt-progress-fill"
              style={{
                width: `${questions.length ? (answered / questions.length) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Questions */}
          <div className="qt-questions">
            {questions.map((q, idx) => {
              let opts = [];
              try {
                opts = JSON.parse(q.optionsJson);
              } catch {}

              return (
                <div key={q.id} className="qt-q-card">
                  <div className="qt-q-num">Câu {idx + 1}</div>
                  <p className="qt-q-text">{q.question}</p>

                  {isMultiple ? (
                    <div className="qt-options">
                      {opts.map((opt, oi) => {
                        const letter = String.fromCharCode(65 + oi);
                        const selected = answers[q.id] === letter;
                        return (
                          <button
                            key={oi}
                            className={`qt-option ${selected ? "qt-option--selected" : ""}`}
                            onClick={() => handleAnswer(q.id, letter)}
                          >
                            <span className="qt-option-letter">{letter}</span>
                            <span className="qt-option-text">
                              {opt.replace(/^[A-D]\.\s*/, "")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // TRUE_FALSE — statements
                    <div className="qt-statements">
                      {opts.map((stmt, si) => {
                        const key = `${q.id}_${si}`;

                        return (
                          <div key={si} className="qt-stmt">
                            <span className="qt-stmt-text">
                              {si + 1}. {stmt.content}
                            </span>

                            <div className="qt-tf-btns">
                              <button
                                className={`qt-tf-btn ${
                                  answers[key] === "true"
                                    ? "qt-tf-btn--true"
                                    : ""
                                }`}
                                onClick={() => handleAnswer(key, "true")}
                              >
                                Đúng
                              </button>

                              <button
                                className={`qt-tf-btn ${
                                  answers[key] === "false"
                                    ? "qt-tf-btn--false"
                                    : ""
                                }`}
                                onClick={() => handleAnswer(key, "false")}
                              >
                                Sai
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="qt-submit-bar">
            <button className="qt-back-btn" onClick={() => navigate("/quiz")}>
              ← Thoát
            </button>
            <button
              className="qt-submit-btn"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              {submitting
                ? "Đang nộp..."
                : `Nộp bài (${answered}/${questions.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
