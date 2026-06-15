import React from "react";
import "./FloatingAssistant.css";

const TypingIndicator = () => {
  return (
    <div className="ai-message-row">
      <div className="ai-avatar-small">
        <span>AI</span>
      </div>
      <div className="typing-indicator">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
};

export default TypingIndicator;
