import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Search,
  Plus,
  Trash2,
  Paperclip,
  Send,
  Sparkles,
  X,
  Lightbulb,
  FileText,
  ClipboardList,
  Target,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatMessage from "../components/ai/ChatMessage";
import TypingIndicator from "../components/ai/TypingIndicator";
import { confirmDelete } from "../utils/swal";
import {
  getChatSessions,
  getMessages,
  deleteSession,
  createSession,
  sendMessage,
  sendMessageWithFile,
} from "../services/chat.services";

import "../styles/ChatAIPage.css";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.userId || user.id || null;
  } catch {
    return null;
  }
};

const SUGGESTIONS = [
  { icon: Lightbulb, text: "Giải thích khái niệm này" },
  { icon: FileText, text: "Cho ví dụ minh họa" },
  { icon: ClipboardList, text: "Tóm tắt nội dung" },
  { icon: Target, text: "Bài tập thực hành" },
];

// ── Nhóm session theo thời gian ──
function groupSessions(sessions, query) {
  const q = query.trim().toLowerCase();
  const filtered = q
    ? sessions.filter((s) => (s.title || "").toLowerCase().includes(q))
    : sessions;

  const groups = { today: [], week: [], older: [] };
  const now = new Date();

  filtered.forEach((s) => {
    const d = new Date(s.createdAt);
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) groups.today.push(s);
    else if (diffDays < 7) groups.week.push(s);
    else groups.older.push(s);
  });

  return groups;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0)
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return d.toLocaleDateString("vi-VN");
}

// ── Preview file đính kèm trong ô input ──
function FilePreview({ file, onRemove }) {
  if (!file) return null;

  return (
    <div className="cap-file-preview">
      <FileText size={15} className="cap-file-icon" />
      <span className="cap-file-name">{file.name}</span>
      <button className="cap-file-remove" onClick={onRemove} type="button">
        <X size={13} />
      </button>
    </div>
  );
}

export default function ChatAIPage() {
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSession, setActiveSession] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const [attachedFile, setAttachedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const userId = getUserId();

  // ── Load danh sách hội thoại ──
  const loadSessions = useCallback(async () => {
    if (!userId) {
      setSessionsLoading(false);
      return;
    }
    setSessionsLoading(true);
    try {
      const data = await getChatSessions(userId);
      setSessions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSessionsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load ban đầu, setState chỉ chạy sau khi API resolve
    loadSessions();
  }, [loadSessions]);

  // ── Load tin nhắn khi đổi session ──
  const loadMessages = useCallback(async (conversationId) => {
    setMessagesLoading(true);
    setError(null);
    try {
      const data = await getMessages(conversationId);
      setMessages(data || []);
    } catch {
      setError("Không thể tải tin nhắn.");
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSession) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- load tin nhắn khi user chọn session khác, không gây cascading render
      loadMessages(activeSession.conversationId);
    } else {
      setMessages([]);
    }
  }, [activeSession, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Auto-resize textarea ──
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  }, [inputValue]);

  const groupedSessions = useMemo(
    () => groupSessions(sessions, searchQuery),
    [sessions, searchQuery],
  );

  const handleSelectSession = (session) => setActiveSession(session);

  const handleNewSession = () => {
    setActiveSession(null);
    setMessages([]);
    setInputValue("");
    setAttachedFile(null);
    setError(null);
    textareaRef.current?.focus();
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    const ok = await confirmDelete(
      "Xóa cuộc hội thoại?",
      "Hành động này không thể hoàn tác.",
    );
    if (!ok) return;
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

  // ── Đính kèm file ──
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

      let sessionId = activeSession?.conversationId;
      let currentSession = activeSession;

      if (!sessionId) {
        if (!userId) {
          setError("Bạn cần đăng nhập để sử dụng Chat AI.");
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
            title: (
              content ||
              attachedFile?.name ||
              "Cuộc hội thoại mới"
            ).slice(0, 50),
            createdAt: new Date().toISOString(),
          };
          setActiveSession(currentSession);
          setSessions((prev) => [currentSession, ...prev]);
        } catch {
          setError("Không thể tạo cuộc hội thoại.");
          return;
        }
      }

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

  const renderSessionGroup = (label, list) => {
    if (list.length === 0) return null;
    return (
      <div className="cap-session-group" key={label}>
        <span className="cap-session-group-label">{label}</span>
        {list.map((s) => (
          <div
            key={s.conversationId}
            className={`cap-session-item${activeSession?.conversationId === s.conversationId ? " cap-session-item--active" : ""}`}
            onClick={() => handleSelectSession(s)}
          >
            <span className="cap-session-dot" />
            <div className="cap-session-info">
              <span className="cap-session-title">{s.title}</span>
              <span className="cap-session-time">{timeAgo(s.createdAt)}</span>
            </div>
            <button
              className="cap-session-delete"
              title="Xóa cuộc hội thoại"
              onClick={(e) => handleDeleteSession(e, s.conversationId)}
              type="button"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="cap-layout">
      <Sidebar />

      <div className="cap-main">
        <Header />

        <div className="cap-body">
          {/* ══ Cột lịch sử trò chuyện ══ */}
          <aside className="cap-history-rail">
            <button
              className="cap-new-chat-btn"
              onClick={handleNewSession}
              type="button"
            >
              <Plus size={17} />
              Cuộc trò chuyện mới
            </button>

            <div className="cap-search-wrap">
              <Search size={14} className="cap-search-icon" />
              <input
                className="cap-search-input"
                placeholder="Tìm trong lịch sử..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="cap-session-list">
              {sessionsLoading ? (
                <div className="cap-history-loading">Đang tải lịch sử...</div>
              ) : sessions.length === 0 ? (
                <div className="cap-history-empty">
                  <Sparkles size={22} />
                  <p>
                    Chưa có cuộc hội thoại nào.
                    <br />
                    Bắt đầu chat với AI Mentor nhé!
                  </p>
                </div>
              ) : (
                <>
                  {renderSessionGroup("Hôm nay", groupedSessions.today)}
                  {renderSessionGroup("7 ngày qua", groupedSessions.week)}
                  {renderSessionGroup("Trước đó", groupedSessions.older)}
                </>
              )}
            </div>
          </aside>

          {/* ══ Khung chat chính ══ */}
          <section className="cap-chat-panel">
            <div className="cap-chat-header">
              <div className="cap-chat-header-left">
                <div className="cap-chat-avatar">
                  <Sparkles size={19} />
                </div>
                <div className="cap-chat-header-info">
                  <span className="cap-chat-header-name">
                    {activeSession?.title || "AI Mentor"}
                  </span>
                  <span className="cap-chat-header-status">
                    <span className="cap-status-dot" />
                    Sẵn sàng hỗ trợ bạn
                  </span>
                </div>
              </div>
            </div>

            <div className="cap-messages">
              {messagesLoading ? (
                <div className="cap-loading">Đang tải tin nhắn...</div>
              ) : messages.length === 0 ? (
                <div className="cap-empty-hero">
                  <div className="cap-empty-icon">
                    <Sparkles size={30} />
                  </div>
                  <h2 className="cap-empty-title">
                    Xin chào! Tôi là AI Mentor
                  </h2>
                  <p className="cap-empty-sub">
                    Hỏi bất cứ điều gì về bài học, hoặc đính kèm tài liệu
                    PDF/DOCX để tôi giúp bạn phân tích và giải thích.
                  </p>
                  <div className="cap-suggestion-grid">
                    {SUGGESTIONS.map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <button
                          key={i}
                          className="cap-suggestion-card"
                          onClick={() => handleSend(s.text)}
                          type="button"
                        >
                          <span className="cap-suggestion-icon">
                            <Icon size={15} />
                          </span>
                          {s.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="cap-message-list">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.messageId} message={msg} />
                  ))}
                  {isTyping && <TypingIndicator />}
                  {error && <div className="cap-error">{error}</div>}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="cap-input-area">
              {attachedFile && (
                <FilePreview file={attachedFile} onRemove={handleRemoveFile} />
              )}
              {fileError && <div className="cap-file-error">{fileError}</div>}

              <div className="cap-input-box">
                <button
                  className="cap-attach-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Đính kèm PDF, DOCX, TXT"
                  type="button"
                >
                  <Paperclip size={18} />
                </button>

                <textarea
                  ref={textareaRef}
                  className="cap-textarea"
                  placeholder={
                    attachedFile
                      ? "Hỏi gì đó về tài liệu..."
                      : "Nhập tin nhắn cho AI Mentor..."
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={isTyping}
                />

                <button
                  className={`cap-send-btn${inputValue.trim() || attachedFile ? " cap-send-btn--active" : ""}`}
                  onClick={() => handleSend()}
                  disabled={(!inputValue.trim() && !attachedFile) || isTyping}
                  title="Gửi (Enter)"
                  type="button"
                >
                  <Send size={17} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <span className="cap-input-hint">
                Enter để gửi • Shift + Enter để xuống dòng
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
