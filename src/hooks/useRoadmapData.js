import { useState, useEffect, useMemo, useCallback } from "react";
import { getRoadmaps, getRoadmapById } from "../services/roadmap.services";
import { getTasksByRoadmapId } from "../services/roadmapTask.services";
import {
  getMilestonesByTaskId,
  createMilestone as createMilestoneApi,
  updateMilestoneStatus as updateMilestoneStatusApi,
} from "../services/milestone.services";
import { mapRoadmapToViewModel } from "../utils/roadmapMapper";
import { mapTasksToStages } from "../utils/taskMapper";
import { mapMilestoneToViewModel } from "../utils/milestoneMapper";
import { findDefaultActiveStage } from "../utils/roadmapUtils";
import { getMilestoneStats } from "../utils/milestoneStatusUtils";

export default function useRoadmapData(initialRoadmapId = null) {
  const [currentRoadmapId, setCurrentRoadmapId] = useState(initialRoadmapId);

  const [roadmap, setRoadmap] = useState(null);
  const [stages, setStages] = useState([]);
  const [activeStageId, setActiveStageId] = useState(null);
  const [allMilestones, setAllMilestones] = useState([]);

  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(true);
  const [isLoadingMilestones, setIsLoadingMilestones] = useState(false);
  const [error, setError] = useState(null);

  // Tải milestone của TẤT CẢ giai đoạn cùng lúc (đủ để vừa hiển thị theo giai đoạn đang chọn,
  // vừa tính tiến độ tổng theo status milestone cho RightProgressPanel)
  const loadAllMilestones = useCallback(async (stagesList) => {
    if (!stagesList || stagesList.length === 0) {
      setAllMilestones([]);
      return [];
    }

    setIsLoadingMilestones(true);

    try {
      const results = await Promise.all(
        stagesList.map((stage) => getMilestonesByTaskId(stage.id))
      );
      const flat = results.flat().map(mapMilestoneToViewModel);
      setAllMilestones(flat);
      return flat;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setIsLoadingMilestones(false);
    }
  }, []);

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
            setAllMilestones([]);
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

        await loadAllMilestones(mappedStages);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setIsLoadingRoadmap(false);
      }
    }

    loadRoadmap();
    return () => { ignore = true; };
  }, [currentRoadmapId, loadAllMilestones]);

  const activeStage = useMemo(
    () => stages.find((stage) => stage.id === activeStageId) ?? null,
    [stages, activeStageId]
  );

  // Milestone hiển thị trong StageDetail/MilestoneList — lọc từ dữ liệu đã tải sẵn, không gọi API lại
  const activeMilestones = useMemo(
    () => allMilestones.filter((m) => m.taskId === activeStageId),
    [allMilestones, activeStageId]
  );

  // Tiến độ tổng cho RightProgressPanel — tính theo status của TẤT CẢ milestone trong roadmap
  const milestoneStats = useMemo(() => getMilestoneStats(allMilestones), [allMilestones]);

  // Chỉ đổi state cục bộ, không có tác vụ bất đồng bộ nào -> không còn rủi ro cascading render
  const selectStage = useCallback((stageId) => {
    setActiveStageId(stageId);
  }, []);

  const addMilestone = useCallback(
    async (payload) => {
      if (!activeStageId) return;

      const created = await createMilestoneApi(activeStageId, payload);
      setAllMilestones((prev) => [...prev, mapMilestoneToViewModel(created)]);
    },
    [activeStageId]
  );

  // MỚI: đổi status 1 milestone, cập nhật lại đúng item đó trong state
  const updateMilestoneStatus = useCallback(async (milestoneId, status) => {
    const updated = await updateMilestoneStatusApi(milestoneId, status);
    const mapped = mapMilestoneToViewModel(updated);

    setAllMilestones((prev) =>
      prev.map((m) => (m.id === mapped.id ? mapped : m))
    );
  }, []);

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
      await loadAllMilestones(mappedStages);
    },
    [reloadStages, loadAllMilestones]
  );

  const setActiveRoadmapId = useCallback((roadmapId) => {
    setCurrentRoadmapId(roadmapId);
  }, []);

  return {
    roadmapId: currentRoadmapId,
    roadmap,
    stages,
    activeStage,
    milestones: activeMilestones,
    stageStats: milestoneStats,
    isLoadingRoadmap,
    isLoadingMilestones,
    error,
    selectStage,
    addMilestone,
    updateMilestoneStatus,
    handleStageCreated,
    setActiveRoadmapId,
  };
}