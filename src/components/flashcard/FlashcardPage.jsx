import "./FlashcardPage.css";

import Stepper from "./Stepper";
import FlashcardEditor from "./FlashcardEditor";
import FlashcardPreview from "./FlashcardPreview";

export default function FlashcardPage() {
  return (
    <div className="flashcard-page">

      {/* HEADER */}
      <div className="flashcard-header">
        <h1>✨ Tạo Flashcard</h1>

        <p>
          Biến tài liệu thành những thẻ ghi nhớ thông minh
        </p>
      </div>

      {/* STEPPER */}
      <Stepper />

      {/* CONTENT */}
      <div className="flashcard-content">

        {/* LEFT */}
        <FlashcardEditor />

        {/* RIGHT */}
        <FlashcardPreview />

      </div>

    </div>
  );
}