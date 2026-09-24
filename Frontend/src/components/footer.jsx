import { useCampusStore } from "@/lib/useCampusStore";

export default function Footer() {
  const groups = useCampusStore((state) => state.footerGroups);

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <path d="M18 3 33 11 18 19 3 11 18 3Z" />
          <path d="m8 15 10 5 10-5v8l-10 5-10-5v-8Z" />
        </svg>
        <strong>CampusFlow</strong>
        <p>Clarity for every day on campus.</p>
      </div>
      {groups.map((group) => (
        <section key={group.label}>
          <h3>{group.label}</h3>
          {group.links.map((link) => (
            <a href="#/" key={link}>{link}</a>
          ))}
        </section>
      ))}
      <div className="footer-social">
        <a href="#/" aria-label="Instagram">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" />
          </svg>
        </a>
        <a href="#/" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 10v6M8 7v.01M12 16v-3.4c0-2.4 4-2.6 4 0V16M12 10v6" />
          </svg>
        </a>
      </div>
      <small>© {new Date().getFullYear()} CampusFlow</small>
    </footer>
  );
}
