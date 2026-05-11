import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* DASHBOARD */}
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App