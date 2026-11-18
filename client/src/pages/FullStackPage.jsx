import { Link } from "react-router-dom";

const layers = [
  ["Frontend", "React.js", "Login form, registration, protected dashboard and navigation."],
  ["Routing", "React Router DOM", "Moves between Login, Dashboard, FLAT, CN and Full Stack modules."],
  ["HTTP client", "Fetch API", "Sends JSON requests to Express and includes session cookies."],
  ["Backend runtime", "Node.js", "Runs the server-side JavaScript application."],
  ["Backend framework", "Express.js", "Implements authentication, validation and protected REST APIs."],
  ["Database layer", "MongoDB + Mongoose", "Stores user records and server-side session documents."],
  ["Security", "bcryptjs + express-session", "Hashes passwords and manages authenticated sessions."]
];

export default function FullStackPage() {
  return (
    <main className="module-page">
      <div className="module-heading">
        <span className="eyebrow">SUBJECT MODULE 03 · FULL STACK DEVELOPMENT</span>
        <h1>Full Stack Application</h1>
        <p className="muted">Explore the technologies and working features used to build this end-to-end authentication system.</p>
      </div>
      <section className="module-card">
        <h2>Application architecture</h2>
        <div className="stack-flow">
          {layers.map(([layer, tech, description], index) => <div className="stack-layer" key={layer}>
            <span className="stack-number">{index + 1}</span><div><small>{layer}</small><b>{tech}</b><p>{description}</p></div>
          </div>)}
        </div>
      </section>
      <section className="module-card">
        <h2>Working application features</h2>
        <div className="concept-grid">
          <article><b>User registration</b><p>Creates a MongoDB user after server-side validation and password hashing.</p></article>
          <article><b>User login</b><p>Verifies the password and creates a MongoDB-backed session.</p></article>
          <article><b>Protected dashboard</b><p>Requires a valid session before protected data is returned.</p></article>
          <article><b>Logout</b><p>Destroys the server-side session and clears its cookie.</p></article>
          <article><b>Form validation</b><p>Checks user input in React and revalidates it on the Express server.</p></article>
          <article><b>Session expiry</b><p>Handles missing or expired sessions and returns the user to login.</p></article>
        </div>
        <div className="button-row">
          <Link className="primary link-button" to="/">Open login application</Link>
          <Link className="secondary link-button" to="/dashboard">Open protected dashboard</Link>
        </div>
      </section>
      <section className="module-card">
        <h2>API endpoint reference</h2>
        <div className="table-wrap"><table><thead><tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr></thead><tbody>
          <tr><td>GET</td><td><code>/api/health</code></td><td>Check server health</td></tr>
          <tr><td>POST</td><td><code>/api/auth/register</code></td><td>Register user</td></tr>
          <tr><td>POST</td><td><code>/api/auth/login</code></td><td>Authenticate user</td></tr>
          <tr><td>GET</td><td><code>/api/auth/me</code></td><td>Check current session</td></tr>
          <tr><td>POST</td><td><code>/api/auth/logout</code></td><td>Destroy session</td></tr>
          <tr><td>GET</td><td><code>/api/protected/dashboard</code></td><td>Get protected data</td></tr>
        </tbody></table></div>
      </section>
    </main>
  );
}
