import { useState } from "react";
import { Button } from "@/common";
import { useAuth } from "@/lib/auth";
import { navigate } from "@/lib/router";

const roles = ["student"];

export default function Signup() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    role: "student",
    username: "",
    email: "",
    id: "",
    password: "",
    phno: "",
    department: "",
    branch: "",
    year: 3,
    semester: 1,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key) => (event) => {
    const value = ["year", "semester"].includes(key) ? Number(event.target.value) : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to create account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <button className="auth-brand" onClick={() => navigate("/")}>
        Campus<span>Flow</span>
      </button>
      <form className="auth-card signup-card" onSubmit={submit}>
        <p className="eyebrow">Start here</p>
        <h1>
          Find your <em>place.</em>
        </h1>
        {error && (
          <p className="form-error" role="alert">
            {error}{" "}
            {/already registered/i.test(error) && (
              <button type="button" onClick={() => navigate("/login")}>
                Sign in instead
              </button>
            )}
          </p>
        )}
        <div className="form-grid">
          <label>
            Role
            <select value={form.role} onChange={set("role")}>
              {roles.map((role) => (
                <option value={role} key={role}>
                  {role.replace("-", " ")}
                </option>
              ))}
            </select>
          </label>
          <label>
            Name
            <input value={form.username} onChange={set("username")} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={set("email")} required />
          </label>
          <label>
            Campus ID
            <input value={form.id} onChange={set("id")} required />
          </label>
          <label>
            Phone
            <input value={form.phno} onChange={set("phno")} required />
          </label>
          <label>
            Department
            <input value={form.department} onChange={set("department")} />
          </label>
          <label>
            Branch
            <input value={form.branch} onChange={set("branch")} placeholder="CSE-DSA" />
          </label>
          {form.role === "student" && (
            <>
              <label>
                Year
                <select value={form.year} onChange={set("year")}>
                  {[1, 2, 3, 4].map((year) => (
                    <option value={year} key={year}>Year {year}</option>
                  ))}
                </select>
              </label>
              <label>
                Semester
                <select value={form.semester} onChange={set("semester")}>
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </label>
            </>
          )}
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              minLength="6"
              required
            />
          </label>
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create account"}
        </Button>
        <p className="auth-switch">
          Already registered?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}
