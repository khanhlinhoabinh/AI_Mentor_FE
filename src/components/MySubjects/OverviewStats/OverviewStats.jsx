import { BookOpen, TrendingUp, Clock, Flame } from "lucide-react";
import "./OverviewStats.css";

export default function OverviewStats({ stats }) {
  return (
    <div className="overview-stats">
      <h2 className="overview-title">Tổng quan học tập</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon-wrap green">
            <BookOpen size={16} />
          </div>
          <div className="stat-value">{stats.totalSubjects}</div>
          <div className="stat-label">Tổng môn học</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrap teal">
            <TrendingUp size={16} />
          </div>
          <div className="stat-value">{stats.avgProgress}%</div>
          <div className="stat-label">Tiến độ trung bình</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrap orange">
            <Clock size={16} />
          </div>
          <div className="stat-value">{stats.totalStudyHours}h</div>
          <div className="stat-label">Tổng thời gian học</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrap purple">
            <Flame size={16} />
          </div>
          <div className="stat-value">{stats.learningStreak}</div>
          <div className="stat-label">Chuỗi ngày học</div>
        </div>
      </div>
    </div>
  );
}