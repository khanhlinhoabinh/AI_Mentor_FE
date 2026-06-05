import "./FlashcardEditor.css";

import answerIcon from "../../assets/FlashcardIcon/answer.png";
import boldIcon from "../../assets/FlashcardIcon/bold.png";
import bulletIcon from "../../assets/FlashcardIcon/bullet.png";
import chevronIcon from "../../assets/FlashcardIcon/chevron.png";
import importIcon from "../../assets/FlashcardIcon/import.png";
import italicIcon from "../../assets/FlashcardIcon/italic.png";
import linkIcon from "../../assets/FlashcardIcon/link.png";
import magicIcon from "../../assets/FlashcardIcon/magic.png";
import pencilIcon from "../../assets/FlashcardIcon/pencil.png";
import plusIcon from "../../assets/FlashcardIcon/plus.png";
import questionIcon from "../../assets/FlashcardIcon/question.png";
import saveIcon from "../../assets/FlashcardIcon/save.png";
import underlineIcon from "../../assets/FlashcardIcon/underline.png";
import levelIcon from "../../assets/FlashcardIcon/level.png";

export default function FlashcardEditor() {
return ( <div className="editor-panel">

```
  <div className="tab-group">

    <button className="tab active">
      <img src={pencilIcon} alt="" />
      Chỉnh sửa thủ công
    </button>

    <button className="tab">
      <img src={magicIcon} alt="" />
      AI gợi ý
    </button>

    <button className="tab">
      <img src={importIcon} alt="" />
      Nhập hàng loạt
    </button>

  </div>

  <div className="form-group">

    <label>
      <img src={questionIcon} alt="" />
      Câu hỏi (Mặt trước)
    </label>

    <input
      type="text"
      placeholder="Ví dụ: Cấu trúc dữ liệu là gì?"
    />

  </div>

  <div className="form-group">

    <label>
      <img src={answerIcon} alt="" />
      Câu trả lời (Mặt sau)
    </label>

    <textarea
      rows="8"
      placeholder="Nhập nội dung câu trả lời..."
    ></textarea>

  </div>

  <div className="toolbar">

    <button>
      <img src={boldIcon} alt="" />
    </button>

    <button>
      <img src={italicIcon} alt="" />
    </button>

    <button>
      <img src={underlineIcon} alt="" />
    </button>

    <button>
      <img src={bulletIcon} alt="" />
    </button>

    <button>
      <img src={linkIcon} alt="" />
    </button>

  </div>

  <div className="row">

    <div className="select-box">

      <label>Danh mục</label>

      <div className="custom-select">
        <span>Cấu trúc dữ liệu & Giải thuật</span>

        <img src={chevronIcon} alt="" />
      </div>

    </div>

    <div className="select-box">

      <label>Độ khó</label>

      <div className="custom-select">

        <div className="difficulty">

          <img src={levelIcon} alt="" />

          <span>Trung bình</span>

        </div>

        <img src={chevronIcon} alt="" />

      </div>

    </div>

  </div>

  <div className="tag-section">

    <label>Tags</label>

    <div className="tag-list">

      <span className="tag">
        cấu trúc dữ liệu
      </span>

      <span className="tag">
        lập trình
      </span>

      <span className="tag">
        cs
      </span>

    </div>

  </div>

  <div className="color-section">

    <label>Màu thẻ</label>

    <div className="colors">

      <div className="color purple active"></div>

      <div className="color green"></div>

      <div className="color yellow"></div>

      <div className="color red"></div>

      <div className="color blue"></div>

    </div>

  </div>

  <div className="action-buttons">

    <button className="add-btn">

      <img src={plusIcon} alt="" />

      Thêm thẻ mới

    </button>

    <button className="save-btn">

      <img src={saveIcon} alt="" />

      Lưu Flashcard

    </button>

  </div>

</div>

);
}
