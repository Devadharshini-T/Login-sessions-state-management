import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, register, status, error, clearError } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setFieldErrors({ ...fieldErrors, [event.target.name]: "" });
    clearError();
    setNotice("");
  };

  function validate() {
    const errors = {};
    if (mode === "register" && form.name.trim().length < 2) errors.name = "Enter at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
    if (mode === "register" && form.password.length < 8) errors.password = "Use at least 8 characters.";
    if (mode === "login" && !form.password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    setNotice("");
    if (!validate()) return;
    try {
      if (mode === "register") {
        const result = await register(form.name.trim(), form.email.trim(), form.password);
        setNotice(result.message);
        setMode("login");
        setForm({ ...form, password: "" });
      } else {
        await login(form.email.trim(), form.password);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.errors?.length) {
        const next = {};
        err.errors.forEach((item) => { next[item.field] = item.message; });
        setFieldErrors(next);
      }
    }
  }

  return (
    <main className="auth-layout">
      <section className="intro">
        <span className="eyebrow">INDIVIDUAL PROJECT · 17</span>
        <h1>Login & Session<br />State Management</h1>
        <p>A secure sign-in flow controlled by a finite-state machine.</p>
        <div className="state-list">
          <span>01 · Logged Out</span><span>02 · Authenticating</span>
          <span>03 · Logged In</span><span>04 · Session Expired</span>
        </div>
      </section>
      <section className="panel">
        <div className="tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setNotice(""); clearError(); }}>Login</button>
          <button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setNotice(""); clearError(); }}>Register</button>
        </div>
        <h2>{mode === "login" ? "Welcome back" : "Create an account"}</h2>
        <p className="muted">{mode === "login" ? "Enter your credentials to continue." : "Register a demo user to test the application."}</p>
        {notice && <div className="success" role="status">{notice}</div>}
        {error && <div className="error-banner" role="alert">{error}</div>}
        <form onSubmit={submit} noValidate>
          {mode === "register" && <label>Full name
            <input name="name" value={form.name} onChange={update} placeholder="Your name" autoComplete="name" />
            {fieldErrors.name && <small>{fieldErrors.name}</small>}
          </label>}
          <label>Email address
            <input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" />
            {fieldErrors.email && <small>{fieldErrors.email}</small>}
          </label>
          <label>Password
            <input name="password" type="password" value={form.password} onChange={update} placeholder={mode === "register" ? "At least 8 characters" : "Enter your password"} autoComplete={mode === "login" ? "current-password" : "new-password"} />
            {fieldErrors.password && <small>{fieldErrors.password}</small>}
          </label>
          <button className="primary" type="submit" disabled={status === "AUTHENTICATING"}>
            {status === "AUTHENTICATING" ? "Authenticating…" : mode === "login" ? "Log in securely" : "Create account"}
          </button>
        </form>
        <p className="footnote">Session cookie is HTTP-only. Passwords are hashed on the server.</p>
      </section>
    </main>
  );
}
