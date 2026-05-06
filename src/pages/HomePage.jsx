import "../styles/global.css";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import SubjectList from "../components/dashboard/SubjectList";
import RightPanel from "../components/dashboard/RightPanel";

export default function HomePage() {
  return (
    <div className="app">
      {/* HEADER FULL NGANG */}
      <Header />

      {/* BODY 3 CỘT */}
      <div className="layout">
        {/* LEFT - SIDEBAR */}
        <Sidebar />

        {/* CENTER - CONTENT */}
        <div className="content">
          <WelcomeBanner />
          <SubjectList />
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}