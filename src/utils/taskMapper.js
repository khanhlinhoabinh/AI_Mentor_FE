import { STAGE_STATUS } from "./roadmapUtils";

/**
 * BE RoadmapTaskStatus chỉ có COMPLETED / NOT_COMPLETED, không có "current".
 * Quy ước: sắp xếp theo startDate, task NOT_COMPLETED đầu tiên = giai đoạn hiện tại.
 */
export function mapTasksToStages(tasks) {
  const sorted = [...tasks].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  const firstNotCompletedIndex = sorted.findIndex(
    (task) => task.status !== "COMPLETED"
  );

  return sorted.map((task, index) => {
    let status = STAGE_STATUS.UPCOMING;

    if (task.status === "COMPLETED") {
      status = STAGE_STATUS.COMPLETED;
    } else if (index === firstNotCompletedIndex) {
      status = STAGE_STATUS.CURRENT;
    }

    return {
      id: task.taskId,
      title: task.taskTitle,
      goal: task.taskGoal,
      startDate: task.startDate,
      endDate: task.endDate,
      order: index + 1,
      status,
      rawStatus: task.status, // giữ status gốc của BE để dùng khi gọi updateTask
    };
  });
}