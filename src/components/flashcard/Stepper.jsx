import "./Stepper.css";

import oneIcon from "../../assets/FlashcardIcon/one.png";
import twoIcon from "../../assets/FlashcardIcon/two.png";
import threeIcon from "../../assets/FlashcardIcon/three.png";
import fourIcon from "../../assets/FlashcardIcon/four.png";

export default function Stepper() {
  const steps = [
    {
      icon: oneIcon,
      title: "Chọn nguồn",
      active: true,
    },
    {
      icon: twoIcon,
      title: "AI xử lý",
    },
    {
      icon: threeIcon,
      title: "Chỉnh sửa thẻ",
    },
    {
      icon: fourIcon,
      title: "Lưu & Học",
    },
  ];

  return (
    <div className="stepper-container">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step-item ${
            step.active ? "active" : ""
          }`}
        >
          <div className="step-icon">
            <img
              src={step.icon}
              alt={step.title}
            />
          </div>

          <span>{step.title}</span>

          {index !== steps.length - 1 && (
            <div className="step-line"></div>
          )}
        </div>
      ))}
    </div>
  );
}