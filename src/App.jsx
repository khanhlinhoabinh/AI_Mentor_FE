import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

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
    </Routes>
  );
}

export default App;
