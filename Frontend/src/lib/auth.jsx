import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await api.get("/user-api/check-auth");
      setUser(data.payload || data.user || null);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  }
  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);
  async function login(email, password) {
    const data = await api.post("/user-api/login", { email, password });
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    const authenticated = await api.get("/user-api/check-auth");
    setUser(authenticated.payload || authenticated.user || data.payload || data.user);
  }
  async function register(body) {
    const data = await api.post("/user-api/register", { ...body, phno: Number(body.phno) || 0 });
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    setUser(data.payload || data.user);
  }
  async function logout() {
    localStorage.removeItem("token");
    try { await api.get("/user-api/logout"); } catch { /* Logout should remain local when the API is unavailable. */ }
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth requires AuthProvider"); return value; }
