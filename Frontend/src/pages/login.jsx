import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { navigate } from "@/lib/router";
import { API_BASE_URL } from "@/lib/api";

const demoPassword = "CampusFlow@2026";
const demoAccounts = [
  ["Student", "student.demo@campusflow.local"],
  ["Faculty", "teacher.demo@campusflow.local"],
  ["HOD", "hod.demo@campusflow.local"],
  ["Placement", "placement.demo@campusflow.local"],
  ["Admin", "admin.demo@campusflow.local"],
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState(demoAccounts[0][1]);
  const [password, setPassword] = useState(demoPassword);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  function pickDemo(demoEmail) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  }

  return (
    <div className="auth-page">
      <button className="auth-brand" onClick={() => navigate("/")}>
        Campus<span>Flow</span>
      </button>
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Welcome back</p>
        <h1>
          Continue your <em>flow.</em>
        </h1>
        <p className="form-intro">Sign in to see what matters today.</p>
        {error && (
          <p className="form-error">
            {error}{" "}
            {/unavailable|failed to fetch|network/i.test(error) && (
              <span>Start the backend or check VITE_API_URL ({API_BASE_URL}).</span>
            )}
          </p>
        )}
        <label>
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="you@campus.edu"
            required
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="••••••••"
            required
          />
        </label>
        <div className="demo-accounts">
          <span>Demo accounts</span>
          <div>
            {demoAccounts.map(([label, demoEmail]) => (
              <button
                type="button"
                key={demoEmail}
                className={email === demoEmail ? "active" : ""}
                onClick={() => pickDemo(demoEmail)}
              >
                {label}
              </button>
            ))}
          </div>
          <small>Password {demoPassword} · API {API_BASE_URL}</small>
        </div>
        <button className="button button-dark" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="auth-switch">
          New to CampusFlow?{" "}
          <button type="button" onClick={() => navigate("/signup")}>
            Create an account
          </button>
        </p>
      </form>
    </div>
  );
}
