
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ModuleNav() {
  const { status } = useAuth();

  const isLoggedIn = status === "LOGGED_IN";

  return (
    <header className="app-nav">
      <NavLink to="/" className="brand">
        LOGIN<span>FSM</span>
      </NavLink>

      {isLoggedIn && (
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/flat">FLAT</NavLink>
          <NavLink to="/cn">CN</NavLink>
          <NavLink to="/fullstack">Full Stack</NavLink>
        </nav>
      )}
    </header>
  );
}
