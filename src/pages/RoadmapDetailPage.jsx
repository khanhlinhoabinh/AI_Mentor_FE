import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

import CreateStagePanel from "../components/roadmap/CreateStagePanel/CreateStagePanel";
import CreateMilestoneModal from "../components/roadmap/CreateMilestoneModal/CreateMilestoneModal";
import RoadmapOverview from "../components/roadmap/RoadmapOverview/RoadmapOverview";
import RoadmapTimeline from "../components/roadmap/RoadmapTimeline/RoadmapTimeline";
import StageDetail from "../components/roadmap/StageDetail/StageDetail";
import MilestoneList from "../components/roadmap/MilestoneList/MilestoneList";
import RightProgressPanel from "../components/roadmap/RightProgressPanel/RightProgressPanel";

import useRoadmapData from "../hooks/useRoadmapData";

import "../styles/Dashboard.css";
import "../styles/RoadmapTokens.css";

export default function RoadmapDetailPage() {
  const { roadmapId: roadmapIdParam } = useParams();

 const {
    roadmapId,
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
    updateMilestoneStatus,
    handleStageCreated,
  } = useRoadmapData(roadmapIdParam);

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  return (
    <div className="page roadmapPage">
      <Header />

      <div className="dashboard">
        <Sidebar />

        <main className="main-content">
          <Link to="/roadmap" className="roadmap-back-link">
            <ArrowLeft size={16} />
            Danh sách roadmap
          </Link>

          {error && <p className="roadmap-error">Không tải được dữ liệu roadmap. Vui lòng thử lại.</p>}

          {!error && (
            <>
              <RoadmapOverview roadmap={roadmap} isLoading={isLoadingRoadmap} />

              <CreateStagePanel
                roadmapId={roadmapId}
                roadmap={roadmap}
                onCreated={handleStageCreated}
                disabled={!roadmap}
              />

              {!isLoadingRoadmap && stages.length === 0 && (
                <p className="roadmap-error">Roadmap này chưa có giai đoạn nào. Hãy thêm giai đoạn đầu tiên ở nút bên trên.</p>
              )}

              <RoadmapTimeline
                stages={stages}
                activeStageId={activeStage?.id ?? null}
                onSelectStage={selectStage}
                isLoading={isLoadingRoadmap}
              />

              <StageDetail
                stage={activeStage}
                milestoneCount={milestones.length}
                onAddMilestone={() => setIsMilestoneModalOpen(true)}
              />

<MilestoneList
                milestones={milestones}
                isLoading={isLoadingMilestones}
                onStatusChange={updateMilestoneStatus}
              />
                          </>
          )}
        </main>

        <RightProgressPanel stats={stageStats} />
      </div>

      {isMilestoneModalOpen && (
        <CreateMilestoneModal
          stageName={activeStage?.title}
          onClose={() => setIsMilestoneModalOpen(false)}
          onSubmit={addMilestone}
        />
      )}
    </div>
  );
}