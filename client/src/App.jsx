
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ModuleNav from "./components/ModuleNav";

import FlatPage from "./pages/FlatPage";
import CNPage from "./pages/CNPage";
import FullStackPage from "./pages/FullStackPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ModuleNav />

        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/flat"
            element={
              <ProtectedRoute>
                <FlatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cn"
            element={
              <ProtectedRoute>
                <CNPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fullstack"
            element={
              <ProtectedRoute>
                <FullStackPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
