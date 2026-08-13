import React from "react";
import { Sparkles } from "lucide-react";
import "./FloatingAssistant.css";

// Minimal markdown renderer (no external deps)
const renderMarkdown = (text) => {
  if (!text) return "";

  let html = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    return `<div class="code-block"><div class="code-lang">${lang || "code"}</div><pre><code>${escapeHtml(code.trim())}</code></pre></div>`;
  });

  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/^### (.*$)/gm, "<h4>$1</h4>");
  html = html.replace(/^## (.*$)/gm, "<h3>$1</h3>");
  html = html.replace(/^# (.*$)/gm, "<h2>$1</h2>");
  html = html.replace(/^\- (.*$)/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
  html = html.replace(/\n/g, "<br />");

  return html;
};

const escapeHtml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "USER";

  if (isUser) {
    return (
      <div className="user-message-row">
        <div className="user-bubble">
          <p>{message.content}</p>
          <span className="msg-time">{formatTime(message.createdAt)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-message-row">
      <div className="ai-avatar-small">
        <Sparkles size={14} />
      </div>
      <div className="ai-bubble">
        <div
          className="ai-bubble-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />
        <span className="msg-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
};

export default ChatMessage;