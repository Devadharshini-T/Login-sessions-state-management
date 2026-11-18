import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout, markSessionExpired } = useAuth();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest("/protected/dashboard")
      .then((result) => setData(result.data))
      .catch((error) => {
        setMessage(error.message);
        if (error.status === 401) {
          markSessionExpired("Your session expired. Please log in again.");
          navigate("/", { replace: true });
        }
      });
  }, [navigate, markSessionExpired]);

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <main className="dashboard">
      <header className="dash-header">
        <div><span className="eyebrow">PROTECTED AREA</span><h1>Secure Dashboard</h1></div>
        <button className="secondary" onClick={handleLogout}>Log out</button>
      </header>
      <section className="welcome-card">
        <div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
        <div><h2>Hello, {user?.name}!</h2><p className="muted">You are authenticated and your session is active.</p></div>
      </section>
      <section className="detail-grid">
        <article className="detail-card"><span>USER NAME</span><strong>{user?.name}</strong></article>
        <article className="detail-card"><span>EMAIL</span><strong>{user?.email}</strong></article>
        <article className="detail-card"><span>FSM STATE</span><strong className="state-pill">LOGGED_IN</strong></article>
      </section>
      <section className="detail-card api-card">
        <h3>Protected API response</h3>
        {message && <p className="error-text">{message}</p>}
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p className="muted">Loading protected data…</p>}
      </section>
      <p className="footnote">Try refreshing this page. The browser checks the existing server-side session.</p>
    </main>
  );
}
