import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import OverviewStats from "../components/MySubjects/OverviewStats/OverviewStats";
import RecentSubjects from "../components/MySubjects/RecentSubjects/RecentSubjects";
import SubjectsGrid from "../components/MySubjects/SubjectsGrid/SubjectsGrid";
import StudyProgress from "../components/MySubjects/StudyProgress/StudyProgress";
import LearningStreak from "../components/MySubjects/LearningStreak/LearningStreak";
import RecentActivity from "../components/MySubjects/RecentActivity/RecentActivity";

import {
  subjects,
  recentSubjects,
  overviewStats,
  studyProgressData,
  streakData,
  recentActivities,
  categories,
  sortOptions,
} from "../components/MySubjects/mockData.js";

import "../styles/MySubjectsPage/MySubjectsPage.css";

export default function MySubjectsPage() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="content-wrapper">
        <Header />

        <main className="my-subjects-content">
          {/* Page heading */}
          

          {/* Top section: left col (overview + recent) + right col (subjects grid) */}
          <div className="ms-top-section">
            <div className="ms-left-col">
              <OverviewStats stats={overviewStats} />
              <RecentSubjects subjects={recentSubjects} />
            </div>

            <div className="ms-right-col">
              <SubjectsGrid
                subjects={subjects}
                categories={categories}
                sortOptions={sortOptions}
              />
            </div>
          </div>

          {/* Bottom section: progress + streak + activity */}
          <div className="ms-bottom-section">
            <StudyProgress data={studyProgressData} />
            <LearningStreak data={streakData} />
            <RecentActivity activities={recentActivities} />
            </div>
        </main>
      </div>
    </div>
  );
}