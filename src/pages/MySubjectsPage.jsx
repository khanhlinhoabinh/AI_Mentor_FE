import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import OverviewStats from "../components/MySubjects/OverviewStats/OverviewStats";
import RecentSubjects from "../components/MySubjects/RecentSubjects/RecentSubjects";
import SubjectsGrid from "../components/MySubjects/SubjectsGrid/SubjectsGrid";
import StudyProgress from "../components/MySubjects/StudyProgress/StudyProgress";

import { getSubjects } from "../services/subject.services";
import { getRoadmaps } from "../services/roadmap.services";
import { getStreak } from "../services/streak.services";

import { studyProgressData, sortOptions } from "../components/MySubjects/mockData.js";

import "../styles/MySubjectsPage.css";

export default function MySubjectsPage() {
  const [overviewStats, setOverviewStats] = useState({
    totalSubjects: null,
    avgProgress: null,
    totalStudyHours: null,
    learningStreak: null,
  });
  const [recentSubjects, setRecentSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subjects, roadmaps, streak] = await Promise.all([
        getSubjects().catch(() => []),
        getRoadmaps().catch(() => []),
        getStreak().catch(() => null),
      ]);

      // Môn học gần đây: sắp xếp theo ngày cập nhật mới nhất, lấy 3 môn
      const sortedSubjects = [...(subjects || [])].sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      );

      // Tiến độ trung bình: tính từ progressPercent của các roadmap đã tạo
      const avgProgress =
        roadmaps && roadmaps.length > 0
          ? Math.round(
              roadmaps.reduce((sum, r) => sum + (r.progressPercent ?? 0), 0) /
                roadmaps.length
            )
          : null;

      setOverviewStats({
        totalSubjects: subjects ? subjects.length : null,
        avgProgress,
        totalStudyHours: null, // Backend chưa có API theo dõi thời gian học
        learningStreak: streak ? streak.currentStreak ?? 0 : null,
      });

      setRecentSubjects(sortedSubjects.slice(0, 3));
    } catch (error) {
      console.error("Load MySubjectsPage data failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Header />

      <div className="content-wrapper">
        <Sidebar />

        <main className="my-subjects-content">
          <div className="ms-content-section">
            {/* Cột trái: Tổng quan + Môn học gần đây + Tiến độ học tập */}
            <div className="ms-left-col">
              <div className="ms-top-group">
                <OverviewStats stats={overviewStats} loading={loading} />
                <RecentSubjects subjects={recentSubjects} loading={loading} />
              </div>

              <StudyProgress data={studyProgressData} />
            </div>

            {/* Cột phải: Danh sách môn học — kéo dài toàn bộ chiều cao */}
            <div className="ms-right-col">
              <SubjectsGrid sortOptions={sortOptions} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}