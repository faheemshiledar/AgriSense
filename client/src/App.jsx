import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute  from "./components/ProtectedRoute";
import Navbar          from "./components/Navbar";
import LandingPage     from "./pages/LandingPage";
import AuthPage        from "./pages/AuthPage";
import Dashboard       from "./pages/Dashboard";
import ResultsPage     from "./pages/ResultsPage";
import HistoryPage     from "./pages/HistoryPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"         element={<LandingPage />} />
              <Route path="/auth"     element={<AuthPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/results"   element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
              <Route path="/history"   element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
              <Route path="*"          element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
