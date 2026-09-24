import { useCallback, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { RouterProvider, navigate, useHashRoute } from "@/lib/router";
import { colorPalette, GlyphPortalPreloader } from "@/common";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";

let introPlayed = false;

function HomeGate() {
  const [ready, setReady] = useState(introPlayed);
  const complete = useCallback(() => {
    introPlayed = true;
    setReady(true);
  }, []);

  return ready ? <Landing /> : <GlyphPortalPreloader onComplete={complete} />;
}

function Routes() {
  const path = useHashRoute();
  const { user, loading } = useAuth();

  if (loading && path !== "/") {
    return <div className="app-loader">Loading CampusFlow…</div>;
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
  return <HomeGate />;
}

export default function App() {
  return (
    <div className="campusflow-app" style={colorPalette}>
      <AuthProvider>
        <RouterProvider>
          <Routes />
        </RouterProvider>
      </AuthProvider>
    </div>
  );
}
