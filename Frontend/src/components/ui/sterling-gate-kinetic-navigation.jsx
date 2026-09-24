import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { navigate } from "@/lib/router";
import "./sterling-gate-kinetic-navigation.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
  CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
}

const items = [
  { label: "Home", detail: "Start at the beginning", target: "top" },
  { label: "Experience", detail: "See campus in motion", target: "#experience" },
  { label: "Community", detail: "Meet every campus role", target: ".landing-story" },
  { label: "Dashboards", detail: "Open your workspace", target: "/dashboard" },
  { label: "Sign in", detail: "Continue your flow", target: "/login" },
];

export default function SterlingGateNavigation() {
  const containerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const cleanups = [];
    const shapes = root.querySelector(".ambient-background-shapes");
    const menuItems = root.querySelectorAll(".menu-list-item[data-shape]");

    menuItems.forEach((item) => {
      const shape = shapes?.querySelector(
        `.bg-shape-${item.getAttribute("data-shape")}`,
      );
      if (!shape) return;

      const shapeElements = shape.querySelectorAll(".shape-element");
      const show = () => {
        shapes
          ?.querySelectorAll(".bg-shape")
          .forEach((itemShape) => itemShape.classList.remove("active"));
        shape.classList.add("active");
        gsap.fromTo(
          shapeElements,
          { opacity: 0, rotation: -8, scale: 0.55 },
          {
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.06,
            ease: "back.out(1.6)",
            overwrite: "auto",
          },
        );
      };
      const hide = () => {
        gsap.to(shapeElements, {
          opacity: 0,
          rotation: 6,
          scale: 0.82,
          duration: 0.28,
          ease: "power2.in",
          overwrite: "auto",
          onComplete: () => shape.classList.remove("active"),
        });
      };

      item.addEventListener("pointerenter", show);
      item.addEventListener("pointerleave", hide);
      item.addEventListener("focus", show);
      item.addEventListener("blur", hide);
      cleanups.push(() => {
        item.removeEventListener("pointerenter", show);
        item.removeEventListener("pointerleave", hide);
        item.removeEventListener("focus", show);
        item.removeEventListener("blur", hide);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const nav = root.querySelector(".nav-overlay-wrapper");
      const menu = root.querySelector(".menu-content");
      const overlay = root.querySelector(".overlay");
      const panels = root.querySelectorAll(".backdrop-layer");
      const links = root.querySelectorAll(".nav-link");
      if (!nav || !menu || !overlay) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const duration = reducedMotion ? 0 : 0.62;
      const timeline = gsap.timeline();

      if (isMenuOpen) {
        nav.setAttribute("data-nav", "open");
        timeline
          .set(nav, { display: "block" })
          .set(menu, { xPercent: 0 }, 0)
          .to(overlay, { autoAlpha: 1, duration: duration * 0.65 }, 0)
          .fromTo(
            panels,
            { xPercent: 101 },
            {
              xPercent: 0,
              duration,
              stagger: reducedMotion ? 0 : 0.08,
              ease: "main",
            },
            0,
          )
          .fromTo(
            links,
            { yPercent: 125, rotation: 7 },
            {
              yPercent: 0,
              rotation: 0,
              duration: duration * 0.8,
              stagger: reducedMotion ? 0 : 0.055,
              ease: "main",
            },
            reducedMotion ? 0 : 0.24,
          );
      } else {
        nav.setAttribute("data-nav", "closed");
        timeline
          .to(overlay, { autoAlpha: 0, duration: duration * 0.45 })
          .to(menu, { xPercent: 120, duration, ease: "main" }, "<")
          .set(nav, { display: "none" });
      }
    }, root);

    return () => context.revert();
  }, [isMenuOpen]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const go = (target) => {
    setIsMenuOpen(false);
    if (target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (target.startsWith("#") || target.startsWith(".")) {
      window.setTimeout(
        () => document.querySelector(target)?.scrollIntoView({ behavior: "smooth" }),
        320,
      );
      return;
    }
    navigate(target);
  };

  return (
    <div ref={containerRef} className="site-header-wrapper">
      <header className="header">
        <div className="container is--full">
          <nav className="nav-row" aria-label="CampusFlow header">
            <button
              className="nav-logo-row"
              onClick={() => go("top")}
              aria-label="CampusFlow home"
            >
              <svg viewBox="0 0 36 36" aria-hidden="true">
                <path d="M18 3 33 11 18 19 3 11 18 3Z" />
                <path d="m8 15 10 5 10-5v8l-10 5-10-5v-8Z" />
              </svg>
              <span>CampusFlow</span>
            </button>
            <button
              className="nav-close-btn"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-controls="campusflow-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <span>{isMenuOpen ? "Close" : "Menu"}</span>
              <i aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M7.33 0v16M0 7.33h16" />
                </svg>
              </i>
            </button>
          </nav>
        </div>
      </header>

      <section className="fullscreen-menu-container">
        <div
          id="campusflow-menu"
          className="nav-overlay-wrapper"
          data-nav="closed"
          role="dialog"
          aria-modal="true"
          aria-label="CampusFlow navigation"
          aria-hidden={!isMenuOpen}
        >
          <button
            className="overlay"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          />
          <nav className="menu-content">
            <div className="menu-bg" aria-hidden="true">
              <div className="backdrop-layer first" />
              <div className="backdrop-layer second" />
              <div className="backdrop-layer" />
              <div className="ambient-background-shapes">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400">
                  <circle className="shape-element" cx="85" cy="115" r="55" />
                  <circle className="shape-element" cx="290" cy="90" r="78" />
                  <circle className="shape-element" cx="220" cy="300" r="96" />
                </svg>
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400">
                  <path
                    className="shape-element shape-stroke"
                    d="M-20 210 Q90 70 200 210 T420 210"
                  />
                  <path
                    className="shape-element shape-stroke"
                    d="M-20 300 Q90 160 200 300 T420 300"
                  />
                </svg>
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400">
                  {[
                    [60, 60],
                    [145, 60],
                    [230, 60],
                    [315, 60],
                    [102, 145],
                    [187, 145],
                    [272, 145],
                    [60, 230],
                    [145, 230],
                    [230, 230],
                    [315, 230],
                    [102, 315],
                    [187, 315],
                    [272, 315],
                  ].map(([cx, cy]) => (
                    <circle
                      className="shape-element"
                      cx={cx}
                      cy={cy}
                      r="10"
                      key={`${cx}-${cy}`}
                    />
                  ))}
                </svg>
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400">
                  <path
                    className="shape-element"
                    d="M80 90 Q150 25 220 90 Q290 155 220 220 Q150 285 80 220 Q10 155 80 90Z"
                  />
                  <path
                    className="shape-element"
                    d="M220 230 Q280 170 340 230 Q400 290 340 350 Q280 410 220 350 Q160 290 220 230Z"
                  />
                </svg>
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400">
                  <path className="shape-element shape-stroke" d="M-30 80 330 440" />
                  <path className="shape-element shape-stroke" d="M70-30 430 330" />
                  <path className="shape-element shape-stroke" d="M170-30 430 230" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <p className="menu-kicker">CampusFlow / navigation</p>
              <h2 className="menu-heading">Find your next move.</h2>
              <ul className="menu-list">
                {items.map((item, index) => (
                  <li
                    className="menu-list-item"
                    data-shape={index + 1}
                    key={item.label}
                  >
                    <button
                      className="nav-link"
                      onClick={() => go(item.target)}
                      style={{ "--delay": `${index * 55}ms` }}
                    >
                      <span className="nav-link-index">0{index + 1}</span>
                      <span className="nav-link-copy">
                        <strong>{item.label}</strong>
                        <small>{item.detail}</small>
                      </span>
                      <span className="nav-link-arrow" aria-hidden="true">↗</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="menu-foot">Small actions. Clearer days.</p>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
