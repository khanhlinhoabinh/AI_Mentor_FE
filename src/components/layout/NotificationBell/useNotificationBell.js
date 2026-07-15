import { useEffect, useRef, useState } from "react";
import {
  getMyNotifications,
  countUnreadNotifications,
  markNotificationAsRead,
  sendMoodFeedback,
} from "../../../services/notification.services";

/**
 * useNotificationBell
 * - Đếm số thông báo chưa đọc (badge trên chuông)
 * - Mở dropdown -> load danh sách đầy đủ
 * - Bấm 1 item -> đánh dấu đã đọc
 * - Với notification loại AI_MESSAGE -> cho phép gửi feedback (😊/☹️)
 *   và hiển thị luôn câu trả lời AI trả về ngay trong item đó
 */
export default function useNotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackLoadingId, setFeedbackLoadingId] = useState(null);
  const [aiReplies, setAiReplies] = useState({}); // { [notificationId]: string }

  const wrapperRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await countUnreadNotifications();
      setUnreadCount(res.data ?? 0);
    } catch (error) {
      console.error("Count unread notifications failed:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await getMyNotifications();
      setNotifications(res.data ?? []);
    } catch (error) {
      console.error("Fetch notifications failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load số lượng chưa đọc ngay khi component mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      fetchNotifications();
    }
  };

  const handleItemClick = async (notification) => {
    if (notification.isRead) return;

    try {
      await markNotificationAsRead(notification.notificationId);

      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notification.notificationId
            ? { ...n, isRead: true }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  const handleFeedback = async (notificationId, mood) => {
    try {
      setFeedbackLoadingId(notificationId);

      const res = await sendMoodFeedback(notificationId, mood);

      setAiReplies((prev) => ({
        ...prev,
        [notificationId]: res.data,
      }));

      // Xem như đã đọc sau khi tương tác feedback
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Send feedback failed:", error);
    } finally {
      setFeedbackLoadingId(null);
    }
  };

  return {
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
  };
}