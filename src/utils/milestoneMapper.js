export function mapMilestoneToViewModel(milestone) {
  return {
    id: milestone.milestoneId,
    taskId: milestone.taskId,
    title: milestone.milestoneTitle,
    description: "", // BE hiện chưa có cột description
    dueDate: milestone.dueDate,
    status: milestone.status, // "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
    icon: "flag", // BE hiện chưa có cột icon/type, dùng icon mặc định
  };
}