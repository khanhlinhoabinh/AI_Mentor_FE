import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";

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
import DocumentTab from "../components/SubjectDetail/DocumentTab"; // ✅ đã có sẵn

import { getSubjectById } from "../services/subject.services";
import {
  documents,
  roadmap,
  activities,
  reminders,
  achievements,
  progressChart,
} from "../components/SubjectDetail/mockData";
import "../styles/SubjectDetailPage.css";

export default function SubjectDetailPage() {
  const [activeTab, setActiveTab] = useState("Tổng quan");
  const { subjectId } = useParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [subject, setSubject] = useState(null);

  // ✅ THÊM MỚI: state lưu số tài liệu thực từ API
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
    loadSubject();
  }, [subjectId]);

  const loadSubject = async () => {
    try {
      const data = await getSubjectById(subjectId);

      setSubject({
        ...data,
        category: "Computer Science",
        totalDocs: 0,           // khởi tạo 0, sẽ được cập nhật bởi DocumentTab
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
  };

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

              {/* ✅ THAY ĐỔI: truyền totalDocs từ state thay vì subject.totalDocs cứng */}
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
                  <FeaturedDocuments documents={documents} />
                  <LearningRoadmap roadmap={roadmap} />
                  <RecentActivities activities={activities} />
                </div>
              )}

              {/* ✅ THÊM MỚI: Tab Tài liệu — gọi DocumentTab thật */}
              {activeTab === "Tài liệu" && (
                <DocumentTab
                  subjectId={subjectId}
                  onCountChange={(n) => setTotalDocs(n)}
                />
              )}

              {/* Placeholder cho các tab chưa làm
                  Loại trừ "Tổng quan" và "Tài liệu" đã có */}
              {activeTab !== "Tổng quan" && activeTab !== "Tài liệu" && (
                <div className="sdp-tab-placeholder">
                  <p>
                    Nội dung tab <strong>{activeTab}</strong> sẽ được hiển thị ở đây.
                  </p>
                </div>
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