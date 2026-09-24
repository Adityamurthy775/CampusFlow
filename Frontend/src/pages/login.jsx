import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { navigate } from "@/lib/router";

export default function Login() {
  const { login } = useAuth(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); setBusy(true); setError(""); try { await login(email, password); navigate("/dashboard"); } catch (err) { setError(err.message || "Unable to sign in"); } finally { setBusy(false); } }
  return <div className="auth-page"><button className="auth-brand" onClick={() => navigate("/")}>Campus<span>Flow</span></button><form className="auth-card" onSubmit={submit}><p className="eyebrow">Welcome back</p><h1>Continue your <em>flow.</em></h1><p className="form-intro">Sign in to see what matters today.</p>{error && <p className="form-error">{error}</p>}<label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@campus.edu" required /></label><label>Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="••••••••" required /></label><button className="button button-dark" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button><p className="auth-switch">New to CampusFlow? <button type="button" onClick={() => navigate("/signup")}>Create an account</button></p></form></div>;
}
