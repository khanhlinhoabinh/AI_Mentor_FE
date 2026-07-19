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

export default function useRoadmapData(initialRoadmapId = null) {
  const [currentRoadmapId, setCurrentRoadmapId] = useState(initialRoadmapId);

  const [roadmap, setRoadmap] = useState(null);
  const [stages, setStages] = useState([]);
  const [activeStageId, setActiveStageId] = useState(null);
  const [milestones, setMilestones] = useState([]);

  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(true);
  const [isLoadingMilestones, setIsLoadingMilestones] = useState(false);
  const [error, setError] = useState(null);

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

  // Effect DUY NHẤT: đồng bộ với API bên ngoài khi roadmapId đổi (đây là lý do chính đáng để dùng effect)
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
            setActiveStageId(null);
            setMilestones([]);
          }
          return;
        }

        const [roadmapData, tasksData] = await Promise.all([
          getRoadmapById(resolvedId),
          getTasksByRoadmapId(resolvedId),
        ]);

        if (ignore) return;

        const mappedStages = mapTasksToStages(tasksData);
        const defaultStage = findDefaultActiveStage(mappedStages);

        setRoadmap(mapRoadmapToViewModel(roadmapData));
        setStages(mappedStages);
        setActiveStageId(defaultStage?.id ?? null);

        if (!currentRoadmapId) setCurrentRoadmapId(resolvedId);

        // Load milestone ngay trong effect này (thay vì effect phụ theo activeStageId)
        await loadMilestones(defaultStage?.id ?? null);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setIsLoadingRoadmap(false);
      }
    }

    loadRoadmap();
    return () => { ignore = true; };
  }, [currentRoadmapId, loadMilestones]);

  const activeStage = useMemo(
    () => stages.find((stage) => stage.id === activeStageId) ?? null,
    [stages, activeStageId]
  );

  const stageStats = useMemo(() => getStageStats(stages), [stages]);

  // Người dùng bấm chọn giai đoạn -> gọi thẳng loadMilestones ở đây, không qua effect
  const selectStage = useCallback(
    (stageId) => {
      setActiveStageId(stageId);
      loadMilestones(stageId);
    },
    [loadMilestones]
  );

  const addMilestone = useCallback(
    async (payload) => {
      if (!activeStageId) return;

      await createMilestoneApi(activeStageId, payload);
      await loadMilestones(activeStageId);
    },
    [activeStageId, loadMilestones]
  );

  const reloadStages = useCallback(async () => {
    if (!currentRoadmapId) return [];

    try {
      const tasksData = await getTasksByRoadmapId(currentRoadmapId);
      const mappedStages = mapTasksToStages(tasksData);
      setStages(mappedStages);
      return mappedStages;
    } catch (err) {
      setError(err);
      return [];
    }
  }, [currentRoadmapId]);

  const handleStageCreated = useCallback(
    async (createdTask) => {
      const mappedStages = await reloadStages();
      const newStage = mappedStages.find((s) => s.id === createdTask.taskId);
      const nextActiveId = newStage?.id ?? findDefaultActiveStage(mappedStages)?.id ?? null;

      setActiveStageId(nextActiveId);
      await loadMilestones(nextActiveId);
    },
    [reloadStages, loadMilestones]
  );

  const setActiveRoadmapId = useCallback((roadmapId) => {
    setCurrentRoadmapId(roadmapId);
  }, []);

  return {
    roadmapId: currentRoadmapId,
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
    handleStageCreated,
    setActiveRoadmapId,
  };
}