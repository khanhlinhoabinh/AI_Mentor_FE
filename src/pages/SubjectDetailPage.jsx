import { useEffect, useState, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import EditSubjectModal from "../components/SubjectDetail/EditSubjectModal/EditSubjectModal";

import SubjectHero from "../components/SubjectDetail/SubjectHero";
import SubjectTabs from "../components/SubjectDetail/SubjectTabs";
import FeaturedDocuments from "../components/SubjectDetail/FeaturedDocuments";
import LearningRoadmap from "../components/SubjectDetail/LearningRoadmap";
import RecentActivities from "../components/SubjectDetail/RecentActivities";
import ProgressWidget from "../components/SubjectDetail/ProgressWidget";
import ReminderWidget from "../components/SubjectDetail/ReminderWidget";
import AchievementWidget from "../components/SubjectDetail/AchievementWidget";
import DocumentTab from "../components/SubjectDetail/DocumentTab";
import SubjectFlashcardTab from "../components/SubjectDetail/SubjectFlashcardTab";
import SubjectQuizTab from "../components/SubjectDetail/SubjectQuizTab";
import SubjectRoadmapTab from "../components/SubjectDetail/SubjectRoadmapTab";

import { getSubjectById } from "../services/subject.services";
import { getDocumentsBySubject } from "../services/document.services";
import { getRoadmaps } from "../services/roadmap.services";
import { getTasksByRoadmapId } from "../services/roadmapTask.services";
import { mapTasksToStages } from "../utils/taskMapper";

import {
  activities,
  reminders,
  achievements,
  progressChart,
} from "../components/SubjectDetail/mockData";
import "../styles/SubjectDetailPage.css";

const MAX_RECENT_DOCS = 5;

export default function SubjectDetailPage() {
  const [activeTab, setActiveTab] = useState("Tổng quan");
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [subject, setSubject] = useState(null);

  const [totalDocs, setTotalDocs] = useState(0);

  const [recentDocs, setRecentDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const [linkedRoadmapId, setLinkedRoadmapId] = useState(null);
  const [roadmapStages, setRoadmapStages] = useState([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);

  // ✅ Khai báo bằng useCallback, đặt TRƯỚC useEffect gọi nó
  const loadSubject = useCallback(async () => {
    try {
      const data = await getSubjectById(subjectId);

      setSubject({
        ...data,
        category: "Computer Science",
        totalDocs: 0,
        updatedAt: data.updatedAt,
        initials: data.subjectName
          ?.split(" ")
          ?.slice(0, 2)
          ?.map(word => word[0].toUpperCase())
          ?.join(""),
        color: "#22c55e",
        students: 0,
        progress: {
          overall: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 100,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [subjectId]);

  const loadRecentDocuments = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const docs = await getDocumentsBySubject(subjectId);
      const sorted = [...(docs || [])].sort((a, b) => {
        const ta = new Date(a.lastEditedAt || a.createdAt);
        const tb = new Date(b.lastEditedAt || b.createdAt);
        return tb - ta;
      });
      setRecentDocs(sorted.slice(0, MAX_RECENT_DOCS));
    } catch (err) {
      console.error("Không thể tải tài liệu gần đây:", err);
      setRecentDocs([]);
    } finally {
      setLoadingDocs(false);
    }
  }, [subjectId]);

  const loadLinkedRoadmap = useCallback(async () => {
    setLoadingRoadmap(true);
    try {
      const allRoadmaps = await getRoadmaps();
      const candidates = (allRoadmaps || []).filter(
        (r) => String(r.subjectId) === String(subjectId)
      );

      if (candidates.length === 0) {
        setLinkedRoadmapId(null);
        setRoadmapStages([]);
        return;
      }

      const target =
        candidates.find((r) => r.status === "IN_PROGRESS") ?? candidates[0];

      const tasks = await getTasksByRoadmapId(target.roadmapId);
      setLinkedRoadmapId(target.roadmapId);
      setRoadmapStages(mapTasksToStages(tasks || []));
    } catch (err) {
      console.error("Không thể tải lộ trình học tập:", err);
      setLinkedRoadmapId(null);
      setRoadmapStages([]);
    } finally {
      setLoadingRoadmap(false);
    }
  }, [subjectId]);

  // ✅ useEffect đặt sau, gọi các hàm đã khai báo ở trên — hết lỗi
  useEffect(() => {
    loadSubject();
    loadRecentDocuments();
    loadLinkedRoadmap();
  }, [loadSubject, loadRecentDocuments, loadLinkedRoadmap]);

  if (!subject) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="sdp-layout">
      <Sidebar />

      <div className="sdp-main">
        <Header />

        <div className="sdp-body">
          {/* Breadcrumb */}
          <nav className="sdp-breadcrumb">
            <span>Môn học của tôi</span>
            <ChevronRight size={14} className="sdp-bc-sep" />
            <span className="sdp-bc-current">
              {subject?.subjectName}
            </span>
          </nav>

          <div className="sdp-content">
            <div className="sdp-center">

              <SubjectHero
                subject={{ ...subject, totalDocs }}
                onEdit={() => setShowEditModal(true)}
              />

              <div className="sdp-tabs-wrap">
                <SubjectTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>

              {/* Tab: Tổng quan */}
              {activeTab === "Tổng quan" && (
                <div className="sdp-tab-content">
                  <FeaturedDocuments
                    documents={recentDocs}
                    loading={loadingDocs}
                    onViewAll={() => setActiveTab("Tài liệu")}
                  />
                  <LearningRoadmap
                    stages={roadmapStages}
                    roadmapId={linkedRoadmapId}
                    loading={loadingRoadmap}
                    onViewDetail={() =>
                      linkedRoadmapId && navigate(`/roadmap/${linkedRoadmapId}`)
                    }
                    onCreateRoadmap={() => navigate("/roadmap")}
                  />
                  <RecentActivities activities={activities} />
                </div>
              )}

              {/* Tab Tài liệu — DocumentTab thật */}
              {activeTab === "Tài liệu" && (
                <DocumentTab
                  subjectId={subjectId}
                  onCountChange={(n) => setTotalDocs(n)}
                />
              )}

              {/* Tab Flashcard — chỉ hiện bộ liên kết với môn học này */}
              {activeTab === "Flashcard" && (
                <SubjectFlashcardTab subjectId={subjectId} />
              )}

              {/* Tab Quiz và Luyện tập — chỉ hiện bộ liên kết với môn học này */}
              {activeTab === "Quiz và Luyện tập" && (
                <SubjectQuizTab subjectId={subjectId} />
              )}

              {/* Tab Lộ trình học tập — chỉ hiện roadmap liên kết với môn học này */}
              {activeTab === "Lộ trình học tập" && (
                <SubjectRoadmapTab subjectId={subjectId} />
              )}

            </div>

            {/* Right panel */}
            <div className="sdp-right">
              <ProgressWidget chartData={progressChart} />
              <ReminderWidget reminders={reminders} />
              <AchievementWidget achievements={achievements} />
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditSubjectModal
          subject={subject}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => loadSubject()}
        />
      )}
    </div>
  );
}