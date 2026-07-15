import { Bell } from "lucide-react";
import "./NotificationBell.css";
import useNotificationBell from "./useNotificationBell";

export default function NotificationBell() {
  const {
    wrapperRef,
    open,
    toggleOpen,
    notifications,
    unreadCount,
    isLoading,
    feedbackLoadingId,
    aiReplies,
    handleItemClick,
    handleFeedback,
  } = useNotificationBell();

  return (
    <div className="notification-bell" ref={wrapperRef}>
      <div
        className={`top-icon${unreadCount > 0 ? " has-unread" : ""}`}
        onClick={toggleOpen}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {open && (
        <div className="notification-panel">
          <div className="notification-panel__header">
            <h4>Thông báo</h4>
          </div>

          <div className="notification-panel__list">
            {isLoading && (
              <p className="notification-empty">Đang tải...</p>
            )}

            {!isLoading && notifications.length === 0 && (
              <p className="notification-empty">Chưa có thông báo nào.</p>
            )}

            {!isLoading &&
              notifications.map((n) => (
                <div
                  key={n.notificationId}
                  className={`notification-item${n.isRead ? "" : " unread"}`}
                  onClick={() => handleItemClick(n)}
                >
                  <div className="notification-item__header">
                    <h5>{n.title}</h5>
                    <span>{formatTime(n.createdAt)}</span>
                  </div>

                  <p className="notification-item__content">{n.content}</p>

                  {n.type === "AI_MESSAGE" && (
                    <div
                      className="notification-item__feedback"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {aiReplies[n.notificationId] ? (
                        <p className="notification-ai-reply">
                          {aiReplies[n.notificationId]}
                        </p>
                      ) : (
                        <div className="notification-mood-buttons">
                          <button
                            disabled={feedbackLoadingId === n.notificationId}
                            onClick={() =>
                              handleFeedback(n.notificationId, "HAPPY")
                            }
                          >
                            😊 Hoàn thành
                          </button>
                          <button
                            disabled={feedbackLoadingId === n.notificationId}
                            onClick={() =>
                              handleFeedback(n.notificationId, "SAD")
                            }
                          >
                            ☹️ Chưa hoàn thành
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Format Timestamp -> "HH:mm dd/MM"
 */
function formatTime(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${hh}:${mm} ${dd}/${month}`;
}