export function mapMilestoneToViewModel(milestone) {
  return {
    id: milestone.milestoneId,
    title: milestone.milestoneTitle,
    description: "", // BE hiện chưa có cột description
    dueDate: milestone.dueDate,
    completed: milestone.completed,
    icon: "flag", // BE hiện chưa có cột icon/type, dùng icon mặc định
  };
}