import React from "react";
import { navigate } from "@/lib/router";

const Button = React.forwardRef(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      default: "bg-accent text-accent-foreground hover:bg-accent/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
      ghost: "text-muted-foreground hover:bg-muted hover:text-foreground"
    };
    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base"
    };
    return (
      <button ref={ref} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

const Menu = ({ className = "", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const X = ({ className = "", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const links = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "Join", href: "#join" },
];

export const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 z-[100] w-full border-b border-border bg-background/85 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <button className="text-xl font-bold text-foreground" onClick={() => navigate("/")}>
            Campus<span className="text-primary">Flow</span>
          </button>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">{l.label}</a>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign in</Button>
            <Button type="button" variant="default" size="sm" onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>

          <button type="button" className="text-foreground md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>{l.label}</a>
            ))}
            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign in</Button>
              <Button type="button" variant="default" size="sm" onClick={() => navigate("/signup")}>Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
Navigation.displayName = "Navigation";

// The separate SAA hero section was removed — the merged hero lives in ./hero-01.jsx
