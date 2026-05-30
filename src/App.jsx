import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* DASHBOARD */}
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
    </Routes>
  )
}

export default App