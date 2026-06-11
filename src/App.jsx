import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ChangePassword from "./pages/ChangePassword";
import FloatingAssistant from "./components/ai/FloatingAssistant";

import MySubjectsPage from "./pages/MySubjectsPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import FlashcardEditPage from "./pages/FlashcardEditPage";
function App() {
  return (
    <>
      <FloatingAssistant />
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* DASHBOARD */}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/admin/change-password" element={<ChangePassword />} />
      <Route path="/mysubjects" element={<MySubjectsPage />} />
      <Route
        path="/mysubjects/:subjectId"
        element={<SubjectDetailPage />}
      />
      <Route path="/flashcards" element={<FlashcardEditPage />} />


    </Routes>
    </>
  );
}

export default App;
