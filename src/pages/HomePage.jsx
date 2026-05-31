import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import SubjectList from "../components/dashboard/SubjectList";
import QuickAccess from "../components/dashboard/QuickAccess";
import RecentDocs from "../components/dashboard/RecentDocs";
import RightPanel from "../components/dashboard/RightPanel";

import "../styles/Dashboard.css";

export default function HomePage() {
  return (
    <div className="page">
      <Header />

      <div className="dashboard">
        <Sidebar />

        <main className="main-content">
          <WelcomeBanner />
          <SubjectList />
          <QuickAccess />
          <RecentDocs />
        </main>

        <RightPanel />
      </div>
    </div>
  );
}