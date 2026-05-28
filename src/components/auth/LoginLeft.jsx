
import "./LoginLeft.css";

export default function LoginLeft() {
  return (
    <div className="login-left">
      <div className="left-content">
        <h1>
          Học thông minh hơn cùng
          <span> AI Mentor</span>
        </h1>

        <p className="desc">
          Nền tảng hỗ trợ học tập cá nhân hóa bằng AI giúp bạn
          quản lý tài liệu, ôn tập hiệu quả và xây dựng lộ trình
          học tập tối ưu.
        </p>

        <div className="feature-list">
          <div className="feature-item">
            <div className="icon">📘</div>

            <div>
              <h4>Quản lý môn học</h4>

              <p>
                Tổ chức tài liệu và nội dung học tập khoa học,
                dễ dàng tra cứu.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon">🤖</div>

            <div>
              <h4>AI hỗ trợ học tập</h4>

              <p>
                Tóm tắt tài liệu, giải thích nội dung và hỗ trợ
                học nhanh hơn.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon">💬</div>

            <div>
              <h4>Chatbot AI thông minh</h4>

              <p>
                Hỏi bài trực tiếp dựa trên tài liệu học tập của
                riêng bạn.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon">📈</div>

            <div>
              <h4>Lộ trình cá nhân hóa</h4>

              <p>
                Theo dõi tiến độ học tập và nhận nhắc nhở phù
                hợp với mục tiêu.
              </p>
            </div>
          </div>
        </div>

        <img
          className="banner-img"
          src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
          alt="AI Mentor"
        />
      </div>
    </div>
  );
}