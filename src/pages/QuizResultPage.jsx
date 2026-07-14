import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import "../styles/QuizResultPage.css";

export default function QuizResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const result = state?.result;

  if (!result) {
    navigate("/quiz");
    return null;
  }

  const {
    score,
    totalQuestions,
    correctCount,
    percentage,
    answersJson,
    questions,
  } = result;

  let userAnswers = {};

  try {
    userAnswers = JSON.parse(answersJson ?? "{}");
  } catch {}

  const pct = Math.round(percentage ?? 0);

  const grade =
    pct >= 90
      ? { label: "Xuất sắc 🏆", color: "#10b981" }
      : pct >= 70
        ? { label: "Giỏi 🌟", color: "#3b82f6" }
        : pct >= 50
          ? { label: "Khá 👍", color: "#f59e0b" }
          : { label: "Cần cố gắng 📚", color: "#ef4444" };

  return (
    <div className="qres-layout">
      <Sidebar />

      <div className="qres-main">
        <Header />

        <div className="qres-body">
          {/* Score */}
          <div className="qres-score-card">
            <div
              className="qres-score-circle"
              style={{ borderColor: grade.color }}
            >
              <span className="qres-score-pct" style={{ color: grade.color }}>
                {pct}%
              </span>

              <span className="qres-score-label">Điểm số</span>
            </div>

            <div className="qres-score-info">
              <div className="qres-grade" style={{ color: grade.color }}>
                {grade.label}
              </div>

              <div className="qres-stats">
                <div className="qres-stat">
                  <span className="qres-stat-val">{correctCount}</span>

                  <span className="qres-stat-lbl">Câu đúng</span>
                </div>

                <div className="qres-stat">
                  <span className="qres-stat-val">
                    {totalQuestions - correctCount}
                  </span>

                  <span className="qres-stat-lbl">Câu sai</span>
                </div>

                <div className="qres-stat">
                  <span className="qres-stat-val">{score}</span>

                  <span className="qres-stat-lbl">Tổng điểm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Review */}
          <div className="qres-review">
            <h3 className="qres-review-title">Xem lại đáp án</h3>

            {questions?.map((q, idx) => {
              let opts = [];

              try {
                opts = JSON.parse(q.optionsJson);
              } catch {}

              const isMultiple = opts.length > 0 && typeof opts[0] === "string";

              return (
                <div key={q.id} className="qres-q-card">
                  <div className="qres-q-top">
                    <span className="qres-q-num">Câu {idx + 1}</span>
                  </div>

                  <p className="qres-q-text">{q.question}</p>

                  {/* MULTIPLE CHOICE */}
                  {isMultiple ? (
                    <div className="qres-options">
                      {opts.map((opt, oi) => {
                        const letter = String.fromCharCode(65 + oi);

                        const isCorrect = letter === q.correctAnswer;

                        const isUser = userAnswers[q.id] === letter;

                        return (
                          <div
                            key={oi}
                            className={`qres-option
                              ${isCorrect ? "qres-option--correct" : ""}
                              ${
                                isUser && !isCorrect ? "qres-option--wrong" : ""
                              }`}
                          >
                            <span className="qres-option-letter">{letter}</span>

                            <span>{opt.replace(/^[A-D]\.\s*/, "")}</span>

                            {isCorrect && (
                              <span className="qres-tag">✓ Đáp án đúng</span>
                            )}

                            {isUser && !isCorrect && (
                              <span className="qres-tag qres-tag--wrong">
                                Bạn chọn
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* TRUE FALSE */
                    <div className="qres-options">
                      {opts.map((stmt, si) => {
                        const key = `${q.id}_${si}`;

                        const user = userAnswers[key];

                        const correct = stmt.answer ? "true" : "false";

                        const right = user === correct;

                        return (
                          <div
                            key={si}
                            className={`qres-option ${
                              right
                                ? "qres-option--correct"
                                : "qres-option--wrong"
                            }`}
                          >
                            <div
                              style={{
                                flex: 1,
                              }}
                            >
                              <strong>{si + 1}.</strong> {stmt.content}
                            </div>

                            <div>
                              <b>Bạn:</b> {user === "true" ? "Đúng" : "Sai"}
                            </div>

                            <div>
                              <b>Đáp án:</b> {stmt.answer ? "Đúng" : "Sai"}
                            </div>

                            <div>{right ? "✅" : "❌"}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="qres-explanation">💡 {q.explanation}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="qres-actions">
            <button
              className="qres-btn qres-btn-outline"
              onClick={() => navigate("/quiz")}
            >
              ← Về danh sách
            </button>

            <button
              className="qres-btn qres-btn-primary"
              onClick={() => navigate(`/quiz/${id}`)}
            >
              🔄 Làm lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
