export default function QuickAccess() {
  return (
    <section className="section">
        <section className="section">
            <div className="section-header">
              <h3>Truy cập nhanh</h3>
            </div>

            <div className="quick-grid">
              <div className="quick-card">
                <div>
                  <div className="quick-icon green">🤖</div>

                  <h4>Chat với AI</h4>

                  <p>Hỏi bài, giải thích kiến thức mọi lúc</p>
                </div>

                <span>Bắt đầu chat →</span>
              </div>

              <div className="quick-card">
                <div>
                  <div className="quick-icon blue">📄</div>

                  <h4>Tóm tắt tài liệu</h4>

                  <p>Tóm tắt nhanh nội dung bằng AI</p>
                </div>

                <span>Tóm tắt ngay →</span>
              </div>

              <div className="quick-card">
                <div>
                  <div className="quick-icon purple">🧠</div>

                  <h4>Tạo Flashcard</h4>

                  <p>Tạo thẻ ghi nhớ thông minh</p>
                </div>

                <span>Tạo thẻ mới →</span>
              </div>

              <div className="quick-card">
                <div>
                  <div className="quick-icon orange">✍️</div>

                  <h4>Luyện tập</h4>

                  <p>Làm bài tập và kiểm tra kiến thức</p>
                </div>

                <span>Luyện tập →</span>
              </div>
            </div>
          </section>
    </section>
  );
}