import "./LoginLeft.css";

import subjectIcon from "../../assets/subjects.png";
import aiIcon from "../../assets/ai-assistant.png";
import chatbotIcon from "../../assets/chat.png";
import roadmapIcon from "../../assets/product.png";

export default function LoginLeft() {
  return (
    <div className="login-left">
      <div className="overlay"></div>

      <div className="left-content">
      
        <h1>
          Học thông minh với
          <span> AI Mentor</span>
        </h1>

        <div className="feature-list">
          <div className="feature-item">
            <img src={subjectIcon} alt="subject" />

            <div>
              <h4>Quản lý môn học</h4>

              <p>
                Tổ chức tài liệu và nội dung học tập khoa học.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <img src={aiIcon} alt="ai" />

            <div>
              <h4>AI hỗ trợ học tập</h4>

              <p>
                Tóm tắt tài liệu và giải thích nội dung nhanh.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <img src={chatbotIcon} alt="chatbot" />

            <div>
              <h4>Chatbot AI thông minh</h4>

              <p>
                Hỏi đáp trực tiếp dựa trên tài liệu của bạn.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <img src={roadmapIcon} alt="roadmap" />

            <div>
              <h4>Lộ trình cá nhân hóa</h4>

              <p>
                Theo dõi tiến độ và nhận nhắc nhở phù hợp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}