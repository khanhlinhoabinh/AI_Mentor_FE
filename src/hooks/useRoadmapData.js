import { useState, useEffect, useMemo, useCallback } from "react";
import { getRoadmaps, getRoadmapById } from "../services/roadmap.services";
import { getTasksByRoadmapId } from "../services/roadmapTask.services";
import {
  getMilestonesByTaskId,
  createMilestone as createMilestoneApi,
} from "../services/milestone.services";
import { mapRoadmapToViewModel } from "../utils/roadmapMapper";
import { mapTasksToStages } from "../utils/taskMapper";
import { mapMilestoneToViewModel } from "../utils/milestoneMapper";
import { findDefaultActiveStage, getStageStats } from "../utils/roadmapUtils";

/**
 * initialRoadmapId: truyền vào khi biết trước roadmap cụ thể (vd route /roadmap/:id).
 * Không truyền -> hook tự lấy roadmap đang IN_PROGRESS của user (fallback roadmap đầu tiên).
 */
export default function useRoadmapData(initialRoadmapId = null) {
  const [currentRoadmapId, setCurrentRoadmapId] = useState(initialRoadmapId);

  const [roadmap, setRoadmap] = useState(null);
  const [stages, setStages] = useState([]);
  const [activeStageId, setActiveStageId] = useState(null);
  const [milestones, setMilestones] = useState([]);

  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(true);
  const [isLoadingMilestones, setIsLoadingMilestones] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function resolveRoadmapId() {
      if (currentRoadmapId) return currentRoadmapId;

      const roadmaps = await getRoadmaps();
      const inProgress = roadmaps.find((r) => r.status === "IN_PROGRESS");
      const target = inProgress ?? roadmaps[0];

      return target?.roadmapId ?? null;
    }

    async function loadRoadmap() {
      setIsLoadingRoadmap(true);
      setError(null);

      try {
        const resolvedId = await resolveRoadmapId();

        if (!resolvedId) {
          if (!ignore) {
            setRoadmap(null);
            setStages([]);
          }
          return;
        }

        const [roadmapData, tasksData] = await Promise.all([
          getRoadmapById(resolvedId),
          getTasksByRoadmapId(resolvedId),
        ]);

        if (ignore) return;

        const mappedStages = mapTasksToStages(tasksData);

        setRoadmap(mapRoadmapToViewModel(roadmapData));
        setStages(mappedStages);
        setActiveStageId(findDefaultActiveStage(mappedStages)?.id ?? null);

        // Khóa lại roadmapId đã resolve để lần load sau không phải gọi getRoadmaps() nữa
        if (!currentRoadmapId) setCurrentRoadmapId(resolvedId);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setIsLoadingRoadmap(false);
      }
    }

    loadRoadmap();
    return () => { ignore = true; };
  }, [currentRoadmapId]);

  const loadMilestones = useCallback(async (taskId) => {
    if (!taskId) {
      setMilestones([]);
      return;
    }

    setIsLoadingMilestones(true);

    try {
      const data = await getMilestonesByTaskId(taskId);
      setMilestones(data.map(mapMilestoneToViewModel));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoadingMilestones(false);
    }
  }, []);

  useEffect(() => {
    loadMilestones(activeStageId);
  }, [activeStageId, loadMilestones]);

  const activeStage = useMemo(
    () => stages.find((stage) => stage.id === activeStageId) ?? null,
    [stages, activeStageId]
  );

  const stageStats = useMemo(() => getStageStats(stages), [stages]);

  const selectStage = useCallback((stageId) => {
    setActiveStageId(stageId);
  }, []);

  const addMilestone = useCallback(
    async (payload) => {
      if (!activeStageId) return;

      await createMilestoneApi(activeStageId, payload);
      await loadMilestones(activeStageId);
    },
    [activeStageId, loadMilestones]
  );

  // Gọi sau khi tạo roadmap mới thành công để chuyển sang xem roadmap đó ngay
  const setActiveRoadmapId = useCallback((roadmapId) => {
    setCurrentRoadmapId(roadmapId);
  }, []);

  return {
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
  };
}