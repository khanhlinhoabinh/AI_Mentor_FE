export const STAGE_STATUS = {
  COMPLETED: "completed",
  CURRENT: "current",
  UPCOMING: "upcoming",
};

export function clampPercent(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.min(100, Math.max(0, num));
}

/**
 * Gộp danh sách stage thành số liệu cho RightProgressPanel.
 * Tách riêng để component chỉ việc render, không tự đếm/tự suy luận.
 */
export function getStageStats(stages) {
  const total = stages.length;
  const completed = stages.filter((s) => s.status === STAGE_STATUS.COMPLETED).length;
  const current = stages.filter((s) => s.status === STAGE_STATUS.CURRENT).length;
  const upcoming = total - completed - current;
  const percent = total === 0 ? 0 : clampPercent(Math.round((completed / total) * 100));

  return { total, completed, current, upcoming, percent };
}

/**
 * Stage mặc định được active khi vào trang: ưu tiên stage đang "current".
 */
export function findDefaultActiveStage(stages) {
  const currentStage = stages.find((s) => s.status === STAGE_STATUS.CURRENT);
  return currentStage ?? stages[0] ?? null;
}