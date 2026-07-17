import {
  MdLogin,
  MdUpload,
  MdQuiz,
  MdStyle,
  MdMenuBook,
  MdLock,
  MdLockOpen,
  MdHistory,
} from "react-icons/md";

/**
 * Ánh xạ action (trả về từ ActivityLogResponse.action) sang
 * icon / màu sắc / nhãn hiển thị cho badge.
 *
 * Backend hiện đã có action: LOCK_USER, UNLOCK_USER.
 * Các action khác (LOGIN, UPLOAD_DOCUMENT, CREATE_QUIZ, CREATE_FLASHCARD,
 * CREATE_SUBJECT...) được map sẵn để tương thích khi backend bổ sung log
 * cho các hành động đó. Action lạ / chưa biết sẽ dùng badge mặc định.
 */
export const ACTIVITY_BADGES = {
  LOGIN: { label: "Login", icon: MdLogin, color: "#2F8F67", bg: "#E8F8F1" },
  UPLOAD_DOCUMENT: { label: "Upload", icon: MdUpload, color: "#5B61FF", bg: "#EEEEFF" },
  CREATE_QUIZ: { label: "Quiz", icon: MdQuiz, color: "#A855F7", bg: "#F3E8FF" },
  CREATE_FLASHCARD: { label: "Flashcard", icon: MdStyle, color: "#F97316", bg: "#FFF0E6" },
  CREATE_SUBJECT: { label: "Subject", icon: MdMenuBook, color: "#0EA5E9", bg: "#E0F2FE" },
  LOCK_USER: { label: "Lock User", icon: MdLock, color: "#EF4444", bg: "#FEE2E2" },
  UNLOCK_USER: { label: "Unlock User", icon: MdLockOpen, color: "#2F8F67", bg: "#E8F8F1" },
};

export const DEFAULT_BADGE = {
  label: "Hoạt động",
  icon: MdHistory,
  color: "#6B7280",
  bg: "#F3F4F6",
};

export const getActivityBadge = (action) =>
  ACTIVITY_BADGES[action] || DEFAULT_BADGE;

/**
 * Định dạng thời gian tương đối kiểu "10 phút trước" từ một timestamp.
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "Vừa xong";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} ngày trước`;
};

/**
 * Gom nhóm danh sách activity logs theo ngày (7 ngày gần nhất) để vẽ
 * ActivityChart. Vì backend chưa có API trả sẵn dữ liệu theo ngày, ta
 * tự tính từ danh sách log thô (GET /activity-logs) — dữ liệu vẫn là
 * dữ liệu thật, chỉ được nhóm lại phía client.
 *
 * Trả về mảng 7 phần tử: { day: "T2".."CN", users, docs }
 * - users: số action liên quan tới người dùng (LOGIN, LOCK_USER, UNLOCK_USER)
 * - docs: số action liên quan tới nội dung (UPLOAD_DOCUMENT, CREATE_QUIZ, CREATE_FLASHCARD, CREATE_SUBJECT)
 */
const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export const buildWeeklyActivitySeries = (logs = []) => {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      key: d.toDateString(),
      day: WEEKDAY_LABELS[d.getDay()],
      users: 0,
      docs: 0,
    });
  }

  const USER_ACTIONS = new Set(["LOGIN", "LOCK_USER", "UNLOCK_USER"]);
  const CONTENT_ACTIONS = new Set([
    "UPLOAD_DOCUMENT",
    "CREATE_QUIZ",
    "CREATE_FLASHCARD",
    "CREATE_SUBJECT",
  ]);

  logs.forEach((log) => {
    if (!log.createdAt) return;
    const logDate = new Date(log.createdAt);
    const bucket = days.find((d) => d.key === logDate.toDateString());
    if (!bucket) return;

    if (USER_ACTIONS.has(log.action)) bucket.users += 1;
    else if (CONTENT_ACTIONS.has(log.action)) bucket.docs += 1;
    else bucket.docs += 1; // hành động chưa phân loại vẫn được tính vào tổng
  });

  return days.map(({ key, ...rest }) => rest);
};