import { createContext, useContext, useEffect, useState } from "react";

const RouterContext = createContext(null);
const current = () => window.location.hash.replace(/^#/, "") || "/";
export function navigate(to) { const target = to.startsWith("#") ? to : `#${to}`; if (window.location.hash !== target) window.location.hash = target; }
export function useHashRoute() { const [path, setPath] = useState(current); useEffect(() => { const update = () => setPath(current()); window.addEventListener("hashchange", update); return () => window.removeEventListener("hashchange", update); }, []); return path; }
export function RouterProvider({ children }) { const path = useHashRoute(); return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>; }
export function useRouter() { return useContext(RouterContext); }
