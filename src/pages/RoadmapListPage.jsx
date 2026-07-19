import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Target, ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

import CreateRoadmapPanel from "../components/roadmap/CreateRoadmapPanel/CreateRoadmapPanel";
import { getRoadmaps } from "../services/roadmap.services";
import { mapRoadmapToViewModel } from "../utils/roadmapMapper";
import { formatDate } from "../utils/dateUtils";
import { clampPercent } from "../utils/roadmapUtils";

import "../styles/Dashboard.css";
import "../styles/RoadmapTokens.css";
import "../styles/RoadmapListPage.css";

export default function RoadmapListPage() {
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRoadmaps = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getRoadmaps();
      setRoadmaps((data || []).map(mapRoadmapToViewModel));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoadmaps();
  }, [loadRoadmaps]);

  const handleRoadmapCreated = (createdRoadmap) => {
    navigate(`/roadmap/${createdRoadmap.roadmapId}`);
  };

  return (
    <div className="page roadmapPage">
      <Header />

      <div className="dashboard">
        <Sidebar />

        <main className="main-content">
          <div className="roadmap-list-header">
            <div>
              <h2 className="roadmap-list-title">Roadmap của bạn</h2>
              <p className="roadmap-list-subtitle">Chọn một roadmap để xem chi tiết, hoặc tạo roadmap mới.</p>
            </div>
          </div>

          <CreateRoadmapPanel onCreated={handleRoadmapCreated} />

          {error && <p className="roadmap-error">Không tải được danh sách roadmap. Vui lòng thử lại.</p>}

          {!error && !isLoading && roadmaps.length === 0 && (
            <p className="roadmap-error">Bạn chưa có roadmap nào. Hãy tạo roadmap mới ở nút phía trên.</p>
          )}

          {isLoading && (
            <div className="roadmap-list-grid">
              <div className="roadmap-list-card roadmap-list-skeleton" />
              <div className="roadmap-list-card roadmap-list-skeleton" />
            </div>
          )}

          {!isLoading && roadmaps.length > 0 && (
            <div className="roadmap-list-grid">
              {roadmaps.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="roadmap-list-card"
                  onClick={() => navigate(`/roadmap/${r.id}`)}
                >
                  <div className="roadmap-list-card-icon">
                    <Target size={22} />
                  </div>

                  <div className="roadmap-list-card-body">
                    <h3 className="roadmap-list-card-title">{r.title}</h3>
                    <p className="roadmap-list-card-goal">{r.goal}</p>

                    <div className="roadmap-list-card-dates">
                      <span>Bắt đầu: {formatDate(r.startDate)}</span>
                      <span>Kết thúc: {formatDate(r.endDate)}</span>
                    </div>

                    <div className="roadmap-list-progress-bar">
                      <div
                        className="roadmap-list-progress-fill"
                        style={{ width: `${clampPercent(r.progress)}%` }}
                      />
                    </div>
                    <span className="roadmap-list-progress-label">{clampPercent(r.progress)}% hoàn thành</span>
                  </div>

                  <ArrowRight size={18} className="roadmap-list-card-arrow" />
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}