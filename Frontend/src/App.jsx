import { useCallback, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { RouterProvider, navigate, useHashRoute } from "@/lib/router";
import { colorPalette, GlyphPortalPreloader } from "@/common";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";

let introPlayed = typeof sessionStorage !== "undefined" && sessionStorage.getItem("cf-intro") === "1";

function Routes() {
  const path = useHashRoute();
  const { user, loading } = useAuth();

  if (loading && path !== "/") {
    return <div className="app-loader" role="status" aria-live="polite"><div className="app-loader-dialog"><span className="app-loader-spinner" /><strong>Loading CampusFlow</strong><small>Hang tight while we fetch your campus data…</small></div></div>;
  }
  if (path === "/login") return <Login />;
  if (path === "/signup") return <Signup />;
  if (path === "/dashboard" || path.startsWith("/dashboard/")) {
    if (!user) {
      navigate("/login");
      return null;
    }
    return <Dashboard />;
  }
  return <Landing />;
}

export default function App() {
  const [ready, setReady] = useState(introPlayed);
  const complete = useCallback(() => {
    introPlayed = true;
    try {
      sessionStorage.setItem("cf-intro", "1");
    } catch {}
    setReady(true);
  }, []);

  return (
    <div className="campusflow-app" style={colorPalette}>
      {!ready && <GlyphPortalPreloader onComplete={complete} />}
      <AuthProvider>
        <RouterProvider>{ready && <Routes />}</RouterProvider>
      </AuthProvider>
    </div>
  );
}
