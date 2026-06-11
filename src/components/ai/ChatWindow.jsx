import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatHistory from "./ChatHistory";
import SuggestionChips from "./SuggestionChips";
import TypingIndicator from "./TypingIndicator";
import {
  getChatSessions,
  getMessages,
  deleteSession,
  createSession,
  sendMessage,
} from "../../services/chat.services";
import "./FloatingAssistant.css";

// TODO: Replace with real user ID from your auth context/store
const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.userId || user.id || null;
  } catch {
    return null;
  }
};

const SUGGESTIONS = [
  "Encapsulation là gì?",
  "Ví dụ minh họa",
  "Đa hình là gì?",
  "Giải thích chi tiết hơn",
];

const ChatWindow = ({ onClose, onMinimize }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const userId = getUserId();

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load sessions when history opens
  useEffect(() => {
    if (showHistory) {
      loadSessions();
    }
  }, [showHistory]);

  // Load messages when session changes
  useEffect(() => {
    if (activeSession) {
      loadMessages(activeSession.conversationId);
    }
  }, [activeSession]);

  const loadSessions = async () => {
    if (!userId) return;
    setSessionsLoading(true);
    try {
      const data = await getChatSessions(userId);
      setSessions(data || []);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setSessionsLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    setMessagesLoading(true);
    setError(null);
    try {
      const data = await getMessages(conversationId);
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Không thể tải tin nhắn. Vui lòng thử lại.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSelectSession = (session) => {
    setActiveSession(session);
    setShowHistory(false);
  };

  const handleDeleteSession = async (conversationId) => {
    try {
      await deleteSession(conversationId);
      setSessions((prev) => prev.filter((s) => s.conversationId !== conversationId));
      if (activeSession?.conversationId === conversationId) {
        setActiveSession(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const handleNewSession = async () => {
    if (!userId) {
      setError("Bạn cần đăng nhập để sử dụng AI Mentor.");
      return;
    }
    try {
      const data = await createSession(userId, "Cuộc hội thoại mới");
      const newSession = {
        conversationId: data.conversationId,
        title: "Cuộc hội thoại mới",
        createdAt: new Date().toISOString(),
      };
      setActiveSession(newSession);
      setMessages([]);
      setSessions((prev) => [newSession, ...prev]);
    } catch (err) {
      console.error("Failed to create session:", err);
      setError("Không thể tạo cuộc hội thoại mới.");
    }
  };

  const handleSend = useCallback(
    async (text) => {
      const content = (text || inputValue).trim();
      if (!content || isTyping) return;

      setError(null);

      // Ensure session exists
      let sessionId = activeSession?.conversationId;
      let currentSession = activeSession;

      if (!sessionId) {
        if (!userId) {
          setError("Bạn cần đăng nhập để sử dụng AI Mentor.");
          return;
        }
        try {
          const data = await createSession(userId, content.slice(0, 50));
          sessionId = data.conversationId;
          currentSession = {
            conversationId: sessionId,
            title: content.slice(0, 50),
            createdAt: new Date().toISOString(),
          };
          setActiveSession(currentSession);
          setSessions((prev) => [currentSession, ...prev]);
        } catch (err) {
          setError("Không thể tạo cuộc hội thoại.");
          return;
        }
      }

      // Add user message optimistically
      const userMsg = {
        messageId: Date.now(),
        sender: "USER",
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      try {
        const res = await sendMessage(sessionId, content);
        const aiMsg = {
          messageId: Date.now() + 1,
          sender: "AI",
          content: res.response,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error("Send message failed:", err);
        setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.messageId !== userMsg.messageId));
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping, activeSession, userId]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttach = () => {
    // TODO: Implement file attachment if needed
    alert("Tính năng đính kèm tệp sẽ sớm ra mắt!");
  };

  return (
    <div className="chat-window-wrapper">
      {showHistory && (
        <ChatHistory
          sessions={sessions}
          activeSessionId={activeSession?.conversationId}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          onViewAll={() => setShowHistory(false)}
          loading={sessionsLoading}
        />
      )}

      <div className="chat-window">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-header-avatar">
              <span>🌱</span>
            </div>
            <div className="chat-header-info">
              <span className="chat-header-name">AI Mentor</span>
              <span className="chat-header-status">
                <span className="status-dot" /> Sẵn sàng hỗ trợ bạn
              </span>
            </div>
          </div>
          <div className="chat-header-actions">
            <button
              className={`header-btn${showHistory ? " header-btn--active" : ""}`}
              title="Lịch sử chat"
              onClick={() => setShowHistory((v) => !v)}
              type="button"
            >
              🕐
            </button>
            <button
              className="header-btn"
              title="Tạo cuộc hội thoại mới"
              onClick={handleNewSession}
              type="button"
            >
              ✏️
            </button>
            <button
              className="header-btn"
              title="Thu nhỏ"
              onClick={onMinimize}
              type="button"
            >
              ―
            </button>
            <button
              className="header-btn header-btn--close"
              title="Đóng"
              onClick={onClose}
              type="button"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="chat-messages">
          {messagesLoading ? (
            <div className="chat-loading">Đang tải tin nhắn...</div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">
              <div className="chat-empty-icon">🌱</div>
              <p className="chat-empty-title">Xin chào! Tôi là AI Mentor</p>
              <p className="chat-empty-sub">
                Hãy đặt câu hỏi hoặc chọn gợi ý bên dưới để bắt đầu.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage key={msg.messageId} message={msg} />
            ))
          )}

          {isTyping && <TypingIndicator />}
          {error && <div className="chat-error">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips */}
        {messages.length === 0 && !messagesLoading && (
          <SuggestionChips suggestions={SUGGESTIONS} onSelect={handleSend} />
        )}

        {/* Input area */}
        <div className="chat-input-area">
          <div className="chat-input-box">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isTyping}
            />
            <button
              className="attach-btn"
              onClick={handleAttach}
              title="Đính kèm"
              type="button"
            >
              📎
            </button>
            <button
              className={`send-btn${inputValue.trim() ? " send-btn--active" : ""}`}
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              title="Gửi (Enter)"
              type="button"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
