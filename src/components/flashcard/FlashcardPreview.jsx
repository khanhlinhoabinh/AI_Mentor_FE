import "./FlashcardPreview.css";

import arrowLeftIcon from "../../assets/FlashcardIcon/ArrowLeft.png";
import arrowRightIcon from "../../assets/FlashcardIcon/ArrowRight.png";
import playIcon from "../../assets/FlashcardIcon/play.png";
import lightbulbIcon from "../../assets/FlashcardIcon/lightbulb.png";

export default function FlashcardPreview() {
  return (
    <div className="preview-panel">

      {/* CARD PREVIEW */}
      <div className="preview-card">

        <div className="preview-top">
          <span className="preview-badge">
            Câu hỏi
          </span>
        </div>

        <div className="preview-content">

          <h2>
            Cấu trúc dữ liệu là gì?
          </h2>

          <div className="preview-divider"></div>

          <span className="preview-badge answer">
            Câu trả lời
          </span>

          <p>
            Cấu trúc dữ liệu là cách tổ chức,
            lưu trữ và quản lý dữ liệu để
            việc truy xuất và xử lý dữ liệu
            hiệu quả hơn.
          </p>

        </div>

      </div>

      {/* NAVIGATION */}

      <div className="preview-navigation">

        <button className="nav-btn">
          <img src={arrowLeftIcon} alt="Previous" />
        </button>

        <span className="card-index">
          1 / 12
        </span>

        <button className="nav-btn">
          <img src={arrowRightIcon} alt="Next" />
        </button>

      </div>

      {/* STUDY MODE */}

      <button className="study-btn">

        <img src={playIcon} alt="" />

        <span>
          Xem chế độ học thử
        </span>

      </button>

      {/* TIP */}

      <div className="tip-card">

        <img
          src={lightbulbIcon}
          alt=""
          className="tip-icon"
        />

        <div>

          <h4>Mẹo học hiệu quả</h4>

          <p>
            Flashcard hoạt động tốt nhất khi
            câu hỏi ngắn gọn và câu trả lời
            tập trung vào các ý chính.
          </p>

        </div>

      </div>

    </div>
  );
}