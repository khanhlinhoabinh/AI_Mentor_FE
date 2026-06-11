import React from "react";
import "./StepProgress.css";

const StepProgress = ({ steps, currentStep }) => {
  return (
    <div className="step-progress">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className={`step-progress__item ${isCompleted ? "step-progress__item--completed" : ""} ${isActive ? "step-progress__item--active" : ""}`}>
              <div className="step-progress__circle">
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7L5.5 10.5L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              <span className="step-progress__label">{step.label}</span>
            </div>
            {!isLast && (
              <div className={`step-progress__arrow ${isCompleted ? "step-progress__arrow--completed" : ""}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;