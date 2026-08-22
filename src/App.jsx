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
import ChatAIPage from "./pages/ChatAIPage";
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
import LearningEvaluationPage from "./pages/LearningEvaluationPage";
import StreakLeaderboardPage from "./pages/StreakLeaderboardPage";
import RemindersPage from "./pages/RemindersPage";

// ✅ Bảo vệ route cho user đã đăng nhập
function ProtectedUserRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <FloatingAssistant />
      <Routes>
        {/* ── Public routes — không cần đăng nhập ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<HomePage />} />

        {/* ── User routes — phải đăng nhập ── */}
        <Route
          path="/"
          element={
            <ProtectedUserRoute>
              <HomePage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/mysubjects"
          element={
            <ProtectedUserRoute>
              <MySubjectsPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/mysubjects/:subjectId"
          element={
            <ProtectedUserRoute>
              <SubjectDetailPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedUserRoute>
              <ChatAIPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/reminders"
          element={
            <ProtectedUserRoute>
              <RemindersPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/flashcards/new"
          element={
            <ProtectedUserRoute>
              <FlashcardCreatePage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/flashcard-sets/:setId/edit"
          element={
            <ProtectedUserRoute>
              <FlashcardEditPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/quiz"
          element={
            <ProtectedUserRoute>
              <QuizListPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/quiz/create"
          element={
            <ProtectedUserRoute>
              <QuizCreatePage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <ProtectedUserRoute>
              <QuizTakePage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/quiz/:id/result"
          element={
            <ProtectedUserRoute>
              <QuizResultPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/roadmap"
          element={
            <ProtectedUserRoute>
              <RoadmapListPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/roadmap/:roadmapId"
          element={
            <ProtectedUserRoute>
              <RoadmapDetailPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedUserRoute>
              <StreakLeaderboardPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/learning-evaluation"
          element={
            <ProtectedUserRoute>
              <LearningEvaluationPage />
            </ProtectedUserRoute>
          }
        />

        {/* ── Admin routes — phải là ADMIN ── */}
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

        <Route
          path="/admin/change-password"
          element={
            <ProtectedAdminRoute>
              <ChangePassword />
            </ProtectedAdminRoute>
          }
        />

        {/* ── Fallback — route không tồn tại ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
