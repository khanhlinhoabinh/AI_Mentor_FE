import React from "react";
import { Trash2 } from "lucide-react";
import "./FloatingAssistant.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return d.toLocaleDateString("vi-VN");
};

const ChatHistory = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onViewAll,
  loading,
}) => {
  return (
    <div className="chat-history-panel">
      <div className="history-header">
        <span className="history-title">Lịch sử trò chuyện</span>
      </div>

      <div className="history-list">
        {loading ? (
          <div className="history-loading">Đang tải...</div>
        ) : sessions.length === 0 ? (
          <div className="history-empty">Chưa có cuộc hội thoại nào</div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.conversationId}
              className={`history-item${activeSessionId === session.conversationId ? " history-item--active" : ""}`}
              onClick={() => onSelectSession(session)}
            >
              <div className="history-item-content">
                <span className="history-item-title">{session.title}</span>
                <span className="history-item-date">
                  {formatDate(session.createdAt)}
                </span>
              </div>
              <button
                className="history-delete-btn"
                title="Xóa"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.conversationId);
                }}
                type="button"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      <button className="view-all-btn" onClick={onViewAll} type="button">
        Xem tất cả lịch sử →
      </button>
    </div>
  );
};

export default ChatHistory;