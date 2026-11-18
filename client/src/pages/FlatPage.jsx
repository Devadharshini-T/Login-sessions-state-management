import { useMemo, useState } from "react";

const STATES = ["LOGGED_OUT", "AUTHENTICATING", "LOGGED_IN", "SESSION_EXPIRED"];
const EVENTS = [
  { value: "VALID_LOGIN", label: "Valid login submitted" },
  { value: "INVALID_INPUT", label: "Invalid form input" },
  { value: "LOGIN_SUCCESS", label: "Backend confirms login" },
  { value: "LOGIN_FAILURE", label: "Backend rejects login" },
  { value: "LOGOUT", label: "User logs out" },
  { value: "SESSION_TIMEOUT", label: "Session expires / API returns 401" }
];

// Complete deterministic transition function. Unlisted combinations are self-loops.
const TRANSITIONS = {
  LOGGED_OUT: {
    VALID_LOGIN: "AUTHENTICATING",
    INVALID_INPUT: "LOGGED_OUT",
    LOGIN_SUCCESS: "LOGGED_OUT",
    LOGIN_FAILURE: "LOGGED_OUT",
    LOGOUT: "LOGGED_OUT",
    SESSION_TIMEOUT: "LOGGED_OUT"
  },
  AUTHENTICATING: {
    VALID_LOGIN: "AUTHENTICATING",
    INVALID_INPUT: "LOGGED_OUT",
    LOGIN_SUCCESS: "LOGGED_IN",
    LOGIN_FAILURE: "LOGGED_OUT",
    LOGOUT: "LOGGED_OUT",
    SESSION_TIMEOUT: "SESSION_EXPIRED"
  },
  LOGGED_IN: {
    VALID_LOGIN: "LOGGED_IN",
    INVALID_INPUT: "LOGGED_IN",
    LOGIN_SUCCESS: "LOGGED_IN",
    LOGIN_FAILURE: "LOGGED_IN",
    LOGOUT: "LOGGED_OUT",
    SESSION_TIMEOUT: "SESSION_EXPIRED"
  },
  SESSION_EXPIRED: {
    VALID_LOGIN: "AUTHENTICATING",
    INVALID_INPUT: "SESSION_EXPIRED",
    LOGIN_SUCCESS: "SESSION_EXPIRED",
    LOGIN_FAILURE: "LOGGED_OUT",
    LOGOUT: "LOGGED_OUT",
    SESSION_TIMEOUT: "SESSION_EXPIRED"
  }
};

const tone = (state) => state === "LOGGED_IN" ? "green" :
  state === "AUTHENTICATING" ? "amber" :
  state === "SESSION_EXPIRED" ? "red" : "slate";

export default function FlatPage() {
  const [state, setState] = useState("LOGGED_OUT");
  const [history, setHistory] = useState([]);
  const [event, setEvent] = useState("VALID_LOGIN");
  const [showTable, setShowTable] = useState(true);

  const transition = () => {
    const next = TRANSITIONS[state][event];
    setHistory((items) => [...items, {
      number: items.length + 1, from: state, input: event, to: next,
      time: new Date().toLocaleTimeString()
    }]);
    setState(next);
  };
  const reset = () => { setState("LOGGED_OUT"); setHistory([]); };
  const rows = useMemo(() => STATES.flatMap((from) =>
    Object.entries(TRANSITIONS[from]).map(([input, to]) => ({ from, input, to }))
  ), []);

  return (
    <main className="module-page">
      <div className="module-heading">
        <span className="eyebrow">SUBJECT MODULE 01 · FLAT</span>
        <h1>Finite State Machine Simulator</h1>
        <p className="muted">Explore how a deterministic finite automaton models the login and session lifecycle.</p>
      </div>

      <section className="module-card">
        <div className="section-title"><div><h2>State transition diagram</h2><p className="muted">Initial state: LOGGED_OUT · Accepting state: LOGGED_IN</p></div><span className="tag purple">DFA</span></div>
        <div className="dfa-flow">
          <div className={`dfa-node ${state === "LOGGED_OUT" ? "current" : ""}`}><b>q0</b><strong>LOGGED_OUT</strong><small>Initial state</small></div>
          <div className="dfa-arrow"><span>VALID_LOGIN</span>↓</div>
          <div className={`dfa-node ${state === "AUTHENTICATING" ? "current" : ""}`}><b>q1</b><strong>AUTHENTICATING</strong><small>Request in progress</small></div>
          <div className="dfa-branches">
            <div className="dfa-branch"><span>LOGIN_SUCCESS</span><div className={`dfa-node accepting ${state === "LOGGED_IN" ? "current" : ""}`}><b>q2</b><strong>LOGGED_IN</strong><small>Accepting state</small></div></div>
            <div className="dfa-branch"><span>LOGIN_FAILURE</span><div className={`dfa-node expired ${state === "LOGGED_OUT" ? "current" : ""}`}><b>q0</b><strong>LOGGED_OUT</strong><small>Return to start</small></div></div>
          </div>
          <div className="dfa-note">From q2: LOGOUT → q0 &nbsp; | &nbsp; SESSION_TIMEOUT → q3</div>
          <div className={`dfa-node expired ${state === "SESSION_EXPIRED" ? "current" : ""}`}><b>q3</b><strong>SESSION_EXPIRED</strong><small>Session no longer valid</small></div>
          <div className="dfa-note">From q3: VALID_LOGIN → q1</div>
        </div>
      </section>

      <section className="module-card">
        <div className="section-title"><div><h2>Interactive DFA execution</h2><p className="muted">Choose an input symbol and execute one transition.</p></div><button className="secondary compact" onClick={reset}>Reset machine</button></div>
        <div className="simulator-grid">
          <div>
            <label>Input symbol</label>
            <select value={event} onChange={(e) => setEvent(e.target.value)}>
              {EVENTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <button className="primary run-button" onClick={transition}>Execute transition →</button>
          </div>
          <div className="state-display">
            <span className="muted">CURRENT AUTOMATON STATE</span>
            <strong className={`state-value ${tone(state)}`}>{state}</strong>
            <span className="muted">State ID: {STATES.indexOf(state) === 0 ? "q0" : STATES.indexOf(state) === 1 ? "q1" : STATES.indexOf(state) === 2 ? "q2" : "q3"}</span>
          </div>
        </div>
        <h3>Execution history</h3>
        {history.length === 0 ? <p className="empty-state">No transitions executed yet. Select an input and click Execute transition.</p> :
          <div className="table-wrap"><table><thead><tr><th>#</th><th>Previous state</th><th>Input</th><th>Next state</th><th>Time</th></tr></thead><tbody>
            {history.map((item) => <tr key={item.number}><td>{item.number}</td><td>{item.from}</td><td>{item.input}</td><td><b>{item.to}</b></td><td>{item.time}</td></tr>)}
          </tbody></table></div>}
      </section>

      <section className="module-card">
        <div className="section-title"><div><h2>DFA transition table</h2><p className="muted">The transition function is deterministic and defined for every state/input pair.</p></div><button className="secondary compact" onClick={() => setShowTable(!showTable)}>{showTable ? "Hide table" : "Show table"}</button></div>
        {showTable && <div className="table-wrap"><table><thead><tr><th>Current state</th><th>Input symbol</th><th>Next state</th></tr></thead><tbody>
          {rows.map((row, i) => <tr key={`${row.from}-${row.input}`}><td>{row.from}</td><td>{row.input}</td><td>{row.to}</td></tr>)}
        </tbody></table></div>}
        <div className="formal-definition"><b>Formal definition:</b> M = (Q, Σ, δ, q0, F)<br/>
          Q = {`{q0, q1, q2, q3}`} · Σ = {`{VALID_LOGIN, INVALID_INPUT, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, SESSION_TIMEOUT}`}<br/>
          q0 = initial state · F = {`{q2}`} (accepting state)
        </div>
      </section>
    </main>
  );
}
