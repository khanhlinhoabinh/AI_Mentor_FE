export const MILESTONE_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

export const MILESTONE_STATUS_LABEL = {
  [MILESTONE_STATUS.NOT_STARTED]: "Chưa bắt đầu",
  [MILESTONE_STATUS.IN_PROGRESS]: "Đang thực hiện",
  [MILESTONE_STATUS.COMPLETED]: "Đã hoàn thành",
};

/**
 * Tính số liệu cho RightProgressPanel dựa theo status của TỪNG milestone
 * (thay vì theo giai đoạn như trước) — phản ánh đúng khi người dùng đổi status milestone.
 */
export function getMilestoneStats(milestones) {
  const total = milestones.length;
  const completed = milestones.filter((m) => m.status === MILESTONE_STATUS.COMPLETED).length;
  const current = milestones.filter((m) => m.status === MILESTONE_STATUS.IN_PROGRESS).length;
  const upcoming = total - completed - current;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, current, upcoming, percent };
}