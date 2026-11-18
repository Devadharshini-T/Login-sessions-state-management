import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { status } = useAuth();
  if (status === "AUTHENTICATING") return <div className="center"><p>Checking session…</p></div>;
  if (status !== "LOGGED_IN") return <Navigate to="/" replace />;
  return children;
}
