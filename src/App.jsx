import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import FlashcardPage from "./flashcard/FlashcardPage";

function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* HOME */}
      <Route
        path="/"
        element={<HomePage />}
      />

      {/* FLASHCARD */}
      <Route
        path="/flashcard"
        element={<FlashcardPage />}
      />

      {/* NOT FOUND */}
      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>
  );
}

export default App;