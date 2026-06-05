import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import FlashcardPageContent from "../components/flashcard/ FlashcardPage";

export default function FlashcardPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Header />
        <FlashcardPageContent />
      </div>
    </div>
  );
}
