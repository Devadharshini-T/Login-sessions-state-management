import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

export default function CNPage() {
  const [logs, setLogs] = useState([]);
  const [checking, setChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState("Run a test to generate real network activity.");

  useEffect(() => {
    const handler = (event) => setLogs((items) => [event.detail, ...items].slice(0, 30));
    window.addEventListener("network-monitor:event", handler);
    return () => window.removeEventListener("network-monitor:event", handler);
  }, []);

  async function runHealthCheck() {
    setChecking(true);
    setCheckMessage("Sending GET /api/health...");
    try {
      const result = await apiRequest("/health");
      setCheckMessage(`Backend responded: ${result.message}`);
    } catch (error) {
      setCheckMessage(`Request failed: ${error.message}`);
    } finally {
      setChecking(false);
    }
  }

  async function checkSession() {
    setChecking(true);
    setCheckMessage("Sending GET /api/auth/me...");
    try {
      const result = await apiRequest("/auth/me");
      setCheckMessage(`Session valid for ${result.user.email}`);
    } catch (error) {
      setCheckMessage(`${error.status || "Network"}: ${error.message}`);
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="module-page">
      <div className="module-heading">
        <span className="eyebrow">SUBJECT MODULE 02 · CN</span>
        <h1>Computer Networks Monitor</h1>
        <p className="muted">Observe real HTTP requests made by this application and understand client-server communication.</p>
      </div>
      <section className="module-card">
        <h2>Client–server architecture</h2>
        <div className="network-flow">
          <div className="network-box client-box"><span>CLIENT</span><b>React + Browser</b><small>http://localhost:5173</small></div>
          <div className="network-connection"><b>HTTP request ↔ response</b><span>Fetch API · TCP/IP transport</span></div>
          <div className="network-box server-box"><span>SERVER</span><b>Node.js + Express</b><small>http://localhost:5000</small></div>
          <div className="network-connection"><b>Database query</b><span>Mongoose connection</span></div>
          <div className="network-box database-box"><span>DATABASE</span><b>MongoDB</b><small>Users + sessions</small></div>
        </div>
        <div className="notice">The browser sends HTTP requests. TCP provides reliable transport for HTTP/1.1 in this local setup. The application does not display raw packet captures.</div>
      </section>

      <section className="module-card">
        <h2>Generate live network requests</h2>
        <p className="muted">These buttons call your running backend. The results below are captured from actual fetch responses.</p>
        <div className="button-row">
          <button className="primary" disabled={checking} onClick={runHealthCheck}>{checking ? "Sending..." : "Test API health (GET)"}</button>
          <button className="secondary" disabled={checking} onClick={checkSession}>Check session (GET)</button>
        </div>
        <div className="notice" role="status">{checkMessage}</div>
      </section>

      <section className="module-card">
        <div className="section-title"><div><h2>Live HTTP traffic log</h2><p className="muted">Requests observed since this page was opened (latest first).</p></div><span className="tag blue">{logs.length} events</span></div>
        {logs.length === 0 ? <p className="empty-state">No network events captured yet. Run a health check, check session, or perform login/logout to see actual traffic here.</p> :
          <div className="table-wrap"><table><thead><tr><th>Time</th><th>Method</th><th>Endpoint</th><th>Status</th><th>Duration</th><th>Result</th></tr></thead><tbody>
            {logs.map((log) => <tr key={log.id}><td>{new Date(log.timestamp).toLocaleTimeString()}</td><td><b>{log.method}</b></td><td><code>{log.endpoint}</code></td><td>{log.status}</td><td>{log.durationMs} ms</td><td><span className={`tag ${log.outcome === "SUCCESS" ? "green" : "red"}`}>{log.outcome}</span></td></tr>)}
          </tbody></table></div>}
      </section>

      <section className="module-card">
        <h2>Computer Networks concepts demonstrated</h2>
        <div className="concept-grid">
          <article><b>HTTP methods</b><p>GET retrieves data; POST sends login, registration and logout requests.</p></article>
          <article><b>Status codes</b><p>200 success, 201 created, 400 validation error, 401 unauthorized, 409 conflict, 500 server error.</p></article>
          <article><b>Cookies and sessions</b><p>An HTTP-only session cookie is automatically sent with credentialed requests.</p></article>
          <article><b>CORS</b><p>Express permits the configured frontend origin and credentials.</p></article>
          <article><b>Client-server model</b><p>React acts as the client; Express processes API requests.</p></article>
          <article><b>TCP/IP</b><p>HTTP communication is transported over the network stack; HTTPS should be used in production.</p></article>
        </div>
      </section>
    </main>
  );
}
