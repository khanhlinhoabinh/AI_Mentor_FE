export function formatDate(dateStr) {
  if (!dateStr) return "";

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export const DUE_DATE_STATUS = {
  OVERDUE: "overdue",
  SOON: "soon",
  NORMAL: "normal",
};

const SOON_THRESHOLD_DAYS = 3;

/**
 * Xác định trạng thái hiển thị của due date để tô màu UI.
 * Logic này KHÔNG nằm trong component, chỉ import và dùng kết quả.
 */
export function getDueDateStatus(dueDate) {
  if (!dueDate) return DUE_DATE_STATUS.NORMAL;

  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return DUE_DATE_STATUS.NORMAL;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.ceil((due - startOfToday) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return DUE_DATE_STATUS.OVERDUE;
  if (diffDays <= SOON_THRESHOLD_DAYS) return DUE_DATE_STATUS.SOON;
  return DUE_DATE_STATUS.NORMAL;
}
/**
 * Trả về text đếm ngược hiển thị: "Hôm nay", "Còn 3 ngày", "Quá hạn 2 ngày"
 */
export function getDaysUntilText(dateStr) {
  if (!dateStr) return "";

  const due = new Date(dateStr);
  if (Number.isNaN(due.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.ceil((due - startOfToday) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Còn 1 ngày";
  if (diffDays > 1) return `Còn ${diffDays} ngày`;
  if (diffDays === -1) return "Quá hạn 1 ngày";
  return `Quá hạn ${Math.abs(diffDays)} ngày`;
}