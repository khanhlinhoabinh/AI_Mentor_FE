import React from "react";
import { Sparkles } from "lucide-react";
import "./FloatingAssistant.css";

const TypingIndicator = () => {
  return (
    <div className="ai-message-row">
      <div className="ai-avatar-small">
        <Sparkles size={14} />
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