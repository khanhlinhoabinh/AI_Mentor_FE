import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute"; // Kiểm tra lại đường dẫn này nếu báo lỗi
import ChangePassword from "./pages/ChangePassword";
import MySubjectsPage from "./pages/MySubjectsPage";
import CreateFlashcardPage from "./pages/CreateFlashcardPage";

function App() {
  return (
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
      <Route path="/flashcards" element={<CreateFlashcardPage />} />
    </Routes>
  );
}

export default App;