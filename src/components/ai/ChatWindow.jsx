import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  History,
  SquarePen,
  Minus,
  X,
  Paperclip,
  Send,
  FileText,
} from "lucide-react";
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
  sendMessageWithFile,
} from "../../services/chat.services";
import "./FloatingAssistant.css";

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

// ── File preview nhỏ hiển thị trong input ──
function FilePreview({ file, onRemove }) {
  if (!file) return null;

  return (
    <div className="chat-file-preview">
      <FileText size={14} className="chat-file-icon" />
      <span className="chat-file-name">{file.name}</span>
      <button className="chat-file-remove" onClick={onRemove} type="button">
        <X size={12} />
      </button>
    </div>
  );
}

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

  // ── File state ──
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const userId = getUserId();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (showHistory) loadSessions();
  }, [showHistory]);

  useEffect(() => {
    if (activeSession) loadMessages(activeSession.conversationId);
  }, [activeSession]);

  const loadSessions = async () => {
    if (!userId) return;
    setSessionsLoading(true);
    try {
      const data = await getChatSessions(userId);
      setSessions(data || []);
    } catch (err) {
      console.error(err);
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
      setError("Không thể tải tin nhắn.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSelectSession = (session) => {
    setActiveSession(session);
    setShowHistory(false);
  };
  const handleDeleteSession = async (id) => {
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.conversationId !== id));
      if (activeSession?.conversationId === id) {
        setActiveSession(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleNewSession = async () => {
    if (!userId) {
      setError("Bạn cần đăng nhập.");
      return;
    }
    try {
      const data = await createSession(userId, "Cuộc hội thoại mới");
      const s = {
        conversationId: data.conversationId,
        title: "Cuộc hội thoại mới",
        createdAt: new Date().toISOString(),
      };
      setActiveSession(s);
      setMessages([]);
      setSessions((prev) => [s, ...prev]);
    } catch {
      setError("Không thể tạo cuộc hội thoại mới.");
    }
  };

  // ── Chọn file ──
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [".pdf", ".docx", ".txt", ".md"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setFileError("Chỉ hỗ trợ PDF, DOCX, TXT, MD");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File tối đa 10MB");
      return;
    }
    setFileError(null);
    setAttachedFile(file);
    e.target.value = "";
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setFileError(null);
  };

  // ── Gửi tin nhắn ──
  const handleSend = useCallback(
    async (text) => {
      const content = (text || inputValue).trim();
      if ((!content && !attachedFile) || isTyping) return;

      setError(null);

      // Tạo session nếu chưa có
      let sessionId = activeSession?.conversationId;
      let currentSession = activeSession;

      if (!sessionId) {
        if (!userId) {
          setError("Bạn cần đăng nhập.");
          return;
        }
        try {
          const data = await createSession(
            userId,
            (content || attachedFile?.name || "Cuộc hội thoại mới").slice(
              0,
              50,
            ),
          );
          sessionId = data.conversationId;
          currentSession = {
            conversationId: sessionId,
            title: content.slice(0, 50),
            createdAt: new Date().toISOString(),
          };
          setActiveSession(currentSession);
          setSessions((prev) => [currentSession, ...prev]);
        } catch {
          setError("Không thể tạo cuộc hội thoại.");
          return;
        }
      }

      // Optimistic message
      const displayContent = attachedFile
        ? `📎 ${attachedFile.name}${content ? "\n" + content : ""}`
        : content;

      const userMsg = {
        messageId: Date.now(),
        sender: "USER",
        content: displayContent,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");

      const fileToSend = attachedFile;
      setAttachedFile(null);
      setIsTyping(true);

      try {
        let res;
        if (fileToSend) {
          // Gửi kèm file
          res = await sendMessageWithFile(
            sessionId,
            content || "Hãy phân tích tài liệu này cho tôi.",
            fileToSend,
          );
        } else {
          res = await sendMessage(sessionId, content);
        }

        setMessages((prev) => [
          ...prev,
          {
            messageId: Date.now() + 1,
            sender: "AI",
            content: res.response,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.error(err);
        setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
        setMessages((prev) =>
          prev.filter((m) => m.messageId !== userMsg.messageId),
        );
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, attachedFile, isTyping, activeSession, userId],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
              <Sparkles size={17} />
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
              <History size={15} />
            </button>
            <button
              className="header-btn"
              title="Tạo mới"
              onClick={handleNewSession}
              type="button"
            >
              <SquarePen size={15} />
            </button>
            <button
              className="header-btn"
              title="Thu nhỏ"
              onClick={onMinimize}
              type="button"
            >
              <Minus size={15} />
            </button>
            <button
              className="header-btn header-btn--close"
              title="Đóng"
              onClick={onClose}
              type="button"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messagesLoading ? (
            <div className="chat-loading">Đang tải tin nhắn...</div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">
              <div className="chat-empty-icon">
                <Sparkles size={26} />
              </div>
              <p className="chat-empty-title">Xin chào! Tôi là AI Mentor</p>
              <p className="chat-empty-sub">
                Hãy đặt câu hỏi hoặc đính kèm tài liệu PDF/DOCX để tôi phân
                tích.
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

        {/* Suggestions */}
        {messages.length === 0 && !messagesLoading && (
          <SuggestionChips suggestions={SUGGESTIONS} onSelect={handleSend} />
        )}

        {/* Input */}
        <div className="chat-input-area">
          {/* File preview */}
          {attachedFile && (
            <FilePreview file={attachedFile} onRemove={handleRemoveFile} />
          )}
          {fileError && <div className="chat-file-error">{fileError}</div>}

          <div className="chat-input-box">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder={
                attachedFile ? "Hỏi gì đó về tài liệu..." : "Nhập tin nhắn..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isTyping}
            />

            {/* Nút đính kèm file */}
            <button
              className="attach-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Đính kèm PDF, DOCX, TXT"
              type="button"
            >
              <Paperclip size={16} />
            </button>

            <button
              className={`send-btn${inputValue.trim() || attachedFile ? " send-btn--active" : ""}`}
              onClick={() => handleSend()}
              disabled={(!inputValue.trim() && !attachedFile) || isTyping}
              title="Gửi (Enter)"
              type="button"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
