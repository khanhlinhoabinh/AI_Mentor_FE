import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import ContentManagementPage from "./pages/ContentManagementPage";
import ReportsPage from "./pages/ReportsPage";
import SystemHistoryPage from "./pages/SystemHistoryPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ChangePassword from "./pages/ChangePassword";
import FloatingAssistant from "./components/ai/FloatingAssistant";

import MySubjectsPage from "./pages/MySubjectsPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import FlashcardCreatePage from "./pages/FlashcardCreatePage";
import FlashcardEditPage from "./pages/FlashcardEditPage";
import QuizListPage from "./pages/QuizListPage";
import QuizCreatePage from "./pages/QuizCreatePage";
import QuizTakePage from "./pages/QuizTakePage";
import QuizResultPage from "./pages/QuizResultPage";
import RoadmapListPage from "./pages/RoadmapListPage";
import RoadmapDetailPage from "./pages/RoadmapDetailPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/ToastOverride.css";

function App() {
  return (
    <>
      <FloatingAssistant />
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />
        {/* DASHBOARD */}
        <Route path="/" element={<HomePage />} />
        {/* ADMIN — chỉ còn 4 chức năng + Dashboard theo yêu cầu PO */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <UserManagementPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <ProtectedAdminRoute>
              <ContentManagementPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedAdminRoute>
              <ReportsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/system-history"
          element={
            <ProtectedAdminRoute>
              <SystemHistoryPage />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin/change-password" element={<ChangePassword />} />
        <Route path="/mysubjects" element={<MySubjectsPage />} />
        <Route path="/mysubjects/:subjectId" element={<SubjectDetailPage />} />
        {/* FLASHCARD */}
        <Route path="/flashcards/new" element={<FlashcardCreatePage />} />
        <Route
          path="/flashcard-sets/:setId/edit"
          element={<FlashcardEditPage />}
        />
        {/* Quiz routes */}
        <Route path="/quiz" element={<QuizListPage />} />
        <Route path="/quiz/create" element={<QuizCreatePage />} />
        <Route path="/quiz/:id" element={<QuizTakePage />} />
        <Route path="/quiz/:id/result" element={<QuizResultPage />} />
        <Route path="/quiz" element={<QuizCreatePage />} />
        <Route path="/roadmap" element={<RoadmapListPage />} />
        <Route
          path="/roadmap/:roadmapId"
          element={<RoadmapDetailPage />}
        />{" "}
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
