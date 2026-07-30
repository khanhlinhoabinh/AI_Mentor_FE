import { BookOpen, TrendingUp, Clock, Flame } from "lucide-react";
import "./OverviewStats.css";

// Hiển thị "—" khi backend chưa có dữ liệu, không dùng số giả
const fmt = (value, suffix = "") =>
  value === null || value === undefined ? "—" : `${value}${suffix}`;

export default function OverviewStats({ stats, loading }) {
  return (
    <div className="overview-stats">
      <h2 className="overview-title">Tổng quan học tập</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon-wrap green">
            <BookOpen size={16} />
          </div>
          <div className="stat-value">
            {loading ? "…" : fmt(stats.totalSubjects)}
          </div>
          <div className="stat-label">Tổng môn học</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrap teal">
            <TrendingUp size={16} />
          </div>
          <div className="stat-value">
            {loading ? "…" : fmt(stats.avgProgress, "%")}
          </div>
          <div className="stat-label">Tiến độ trung bình</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrap orange">
            <Clock size={16} />
          </div>
          <div className="stat-value">
            {loading ? "…" : fmt(stats.totalStudyHours, "h")}
          </div>
          <div className="stat-label">Tổng thời gian học</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrap purple">
            <Flame size={16} />
          </div>
          <div className="stat-value">
            {loading ? "…" : fmt(stats.learningStreak)}
          </div>
          <div className="stat-label">Chuỗi ngày học</div>
        </div>
      </div>
    </div>
  );
}