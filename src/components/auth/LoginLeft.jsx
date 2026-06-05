import "./LoginLeft.css";

import BookIcon from "../../assets/IconsLeft/Book.png";
import AIIcon from "../../assets/IconsLeft/AI.png";
import ChatbotIcon from "../../assets/IconsLeft/Chatbot.png";
import FlashcardIcon from "../../assets/IconsLeft/Flashcard.png";
import RoadmapIcon from "../../assets/IconsLeft/Roadmap.png";

import LoginBanner from "../../assets/images/LoginBanner.png";

export default function LoginLeft() {
  return (
    <div className="login-left">
      <div className="left-content">
        <h1>
          Chào mừng bạn đến với
          <span> AI Mentor</span>
        </h1>

        <p className="desc">
          Trợ lý học tập AI thông minh, đồng hành cùng bạn
          trên hành trình chinh phục tri thức.
        </p>

        <div className="feature-list">
          <div className="feature-item">
            <div className="icon">
              <img src={BookIcon} alt="Book" />
            </div>

            <div>
              <h4>Quản lý môn học & tài liệu</h4>
              <p>
                Tổ chức tài liệu khoa học, dễ dàng truy cập
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon">
              <img src={AIIcon} alt="AI" />
            </div>

            <div>
              <h4>AI tóm tắt & giải thích</h4>
              <p>
                Tóm tắt nội dung, giải thích nhanh chóng
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon">
              <img src={ChatbotIcon} alt="Chatbot" />
            </div>

            <div>
              <h4>Chatbot hỏi đáp thông minh</h4>
              <p>
                Đặt câu hỏi và nhận giải đáp chi tiết từ AI
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon">
              <img src={FlashcardIcon} alt="Flashcard" />
            </div>

            <div>
              <h4>Flashcard thông minh</h4>
              <p>
                Tạo bộ thẻ ghi nhớ tự động từ tài liệu học tập
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="icon">
              <img src={RoadmapIcon} alt="Roadmap" />
            </div>

            <div>
              <h4>Lộ trình học tập cá nhân hóa</h4>
              <p>
                Xây dựng lộ trình phù hợp với mục tiêu của bạn
              </p>
            </div>
          </div>
        </div>

        <img
          src={LoginBanner}
          alt="AI Mentor"
          className="banner-img"
        />
      </div>
    </div>
  );
}