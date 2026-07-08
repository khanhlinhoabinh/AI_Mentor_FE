export function mapRoadmapToViewModel(roadmap) {
  if (!roadmap) return null;

  return {
    id: roadmap.roadmapId,
    subjectId: roadmap.subjectId,
    subjectName: roadmap.subjectName,
    title: roadmap.roadmapTitle,
    goal: roadmap.learningGoal,
    startDate: roadmap.startDate,
    endDate: roadmap.endDate,
    progress: roadmap.progressPercent ?? 0,
    status: roadmap.status,
  };
}