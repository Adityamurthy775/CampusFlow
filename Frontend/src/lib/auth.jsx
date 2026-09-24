import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try { const data = await api.get("/user-api/check-auth"); setUser(data.payload || data.user || null); }
    catch { setUser(null); }
  }
  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);
  async function login(email, password) { const data = await api.post("/user-api/login", { email, password }); setUser(data.payload || data.user); }
  async function register(body) { const data = await api.post("/user-api/register", { ...body, phno: Number(body.phno) || 0 }); setUser(data.payload || data.user); }
  async function logout() { try { await api.get("/user-api/logout"); } catch { /* Logout should remain local when the API is unavailable. */ } setUser(null); }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth requires AuthProvider"); return value; }
