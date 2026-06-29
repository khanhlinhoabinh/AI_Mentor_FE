import React from "react";
import "./StepProgress.css";

/**
 * StepProgress - Shows the 4-step quiz creation progress
 * Highlights current step with blue, connects steps with arrows
 */
const StepProgress = ({ steps, currentStep }) => {
  return (
    <div className="step-progress">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`step-progress__step ${isActive ? "step-progress__step--active" : ""} ${isCompleted ? "step-progress__step--completed" : ""}`}
            >
              <div className="step-progress__circle">
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              <div className="step-progress__info">
                <span className="step-progress__label">{step.label}</span>
                <span className="step-progress__sublabel">{step.sublabel}</span>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className={`step-progress__connector ${isCompleted ? "step-progress__connector--done" : ""}`}>
                <svg width="20" height="2" viewBox="0 0 20 2">
                  <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
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