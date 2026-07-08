import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

import CreateRoadmapPanel from "../components/roadmap/CreateRoadmapPanel/CreateRoadmapPanel";
import RoadmapOverview from "../components/roadmap/RoadmapOverview/RoadmapOverview";
import RoadmapTimeline from "../components/roadmap/RoadmapTimeline/RoadmapTimeline";
import StageDetail from "../components/roadmap/StageDetail/StageDetail";
import MilestoneList from "../components/roadmap/MilestoneList/MilestoneList";
import RightProgressPanel from "../components/roadmap/RightProgressPanel/RightProgressPanel";

import useRoadmapData from "../hooks/useRoadmapData";

import "../styles/Dashboard.css";
import "../styles/RoadmapTokens.css";

export default function RoadmapPage() {
  const {
    roadmap,
    stages,
    activeStage,
    milestones,
    stageStats,
    isLoadingRoadmap,
    isLoadingMilestones,
    error,
    selectStage,
    addMilestone,
    setActiveRoadmapId,
  } = useRoadmapData();

  const handleRoadmapCreated = (createdRoadmap) => {
    setActiveRoadmapId(createdRoadmap.roadmapId);
  };

  // TODO: thay bằng modal thật khi có thiết kế UI riêng cho việc tạo milestone
  const handleAddMilestone = async () => {
    const title = window.prompt("Tên milestone:");
    if (!title) return;

    const dueDate = window.prompt("Hạn hoàn thành (yyyy-mm-dd):");
    if (!dueDate) return;

    try {
      await addMilestone({ milestoneTitle: title, dueDate });
    } catch (err) {
      console.error("Không thể tạo milestone:", err);
    }
  };

  return (
    <div className="page roadmapPage">
      <Header />

      <div className="dashboard">
        <Sidebar />

        <main className="main-content">
          <CreateRoadmapPanel onCreated={handleRoadmapCreated} />

          {error && <p className="roadmap-error">Không tải được dữ liệu roadmap. Vui lòng thử lại.</p>}

          {!error && !roadmap && !isLoadingRoadmap && (
            <p className="roadmap-error">Bạn chưa có roadmap nào. Hãy tạo roadmap mới ở nút phía trên.</p>
          )}

          {!error && (roadmap || isLoadingRoadmap) && (
            <>
              <RoadmapOverview roadmap={roadmap} isLoading={isLoadingRoadmap} />

              <RoadmapTimeline
                stages={stages}
                activeStageId={activeStage?.id ?? null}
                onSelectStage={selectStage}
                isLoading={isLoadingRoadmap}
              />

              <StageDetail
                stage={activeStage}
                milestoneCount={milestones.length}
                onAddMilestone={handleAddMilestone}
              />

              <MilestoneList
                milestones={milestones}
                isLoading={isLoadingMilestones}
                onAddMilestone={handleAddMilestone}
              />
            </>
          )}
        </main>

        <RightProgressPanel stats={stageStats} />
      </div>
    </div>
  );
}