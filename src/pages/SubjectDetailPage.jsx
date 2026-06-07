import { useState } from "react";
import { ChevronRight } from "lucide-react";

// Layout components (already exist in project)
import Sidebar from "../components/layout/Sidebar";
import Header  from "../components/layout/Header";

// SubjectDetail components
import SubjectHero        from "../components/SubjectDetail/SubjectHero";
import SubjectTabs        from "../components/SubjectDetail/SubjectTabs";
import FeaturedDocuments  from "../components/SubjectDetail/FeaturedDocuments";
import LearningRoadmap    from "../components/SubjectDetail/LearningRoadmap";
import RecentActivities   from "../components/SubjectDetail/RecentActivities";
import ProgressWidget     from "../components/SubjectDetail/ProgressWidget";
import ReminderWidget     from "../components/SubjectDetail/ReminderWidget";
import AchievementWidget  from "../components/SubjectDetail/AchievementWidget";

// Mock data (swap for API calls later)
import {
  subjectData,
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

  return (
    <div className="sdp-layout">
      {/* ─── Sidebar ─── */}
      <Sidebar />

      {/* ─── Main area ─── */}
      <div className="sdp-main">
        <Header />

        <div className="sdp-body">
          {/* ── Breadcrumb ── */}
          <nav className="sdp-breadcrumb">
            <span>Môn học của tôi</span>
            <ChevronRight size={14} className="sdp-bc-sep" />
            <span className="sdp-bc-current">{subjectData.name}</span>
          </nav>

          {/* ── Content grid ── */}
          <div className="sdp-content">
            {/* Left / center column */}
            <div className="sdp-center">
              {/* Hero */}
              <SubjectHero subject={subjectData} />

              {/* Tabs */}
              <div className="sdp-tabs-wrap">
                <SubjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>

              {/* Tab content: Tổng quan */}
              {activeTab === "Tổng quan" && (
                <div className="sdp-tab-content">
                  <FeaturedDocuments documents={documents} />
                  <LearningRoadmap   roadmap={roadmap} />
                  <RecentActivities  activities={activities} />
                </div>
              )}

              {/* Placeholder for other tabs — easy to add later */}
              {activeTab !== "Tổng quan" && (
                <div className="sdp-tab-placeholder">
                  <p>Nội dung tab <strong>{activeTab}</strong> sẽ được hiển thị ở đây.</p>
                </div>
              )}
            </div>

            {/* Right panel */}
            <div className="sdp-right">
              <ProgressWidget   chartData={progressChart} />
              <ReminderWidget   reminders={reminders} />
              <AchievementWidget achievements={achievements} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}