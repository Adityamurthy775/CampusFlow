import Button from "./ui/button";
import { useCampusStore } from "@/lib/useCampusStore";
import { navigate } from "@/lib/router";

export default function Navbar() {
  const navigation = useCampusStore((state) => state.navigation);

  const go = (item) => {
    if (item.route) {
      navigate(item.route);
      return;
    }
    document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <button className="navbar-brand" onClick={() => go({ target: "top" })} aria-label="CampusFlow home">
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <path d="M18 3 33 11 18 19 3 11 18 3Z" />
            <path d="m8 15 10 5 10-5v8l-10 5-10-5v-8Z" />
          </svg>
          <span>CampusFlow</span>
        </button>
        <nav aria-label="Main navigation">
          {navigation.map((item) => (
            <button key={item.label} onClick={() => go(item)}>
              {item.label}
            </button>
          ))}
        </nav>
        <Button onClick={() => navigate("/signup")}>Join CampusFlow</Button>
      </div>
    </header>
  );
}
