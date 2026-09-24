import { Children, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function FlowSection({
  children,
  className,
  style,
  "aria-label": ariaLabel,
}) {
  return (
    <section
      data-flow-section
      aria-label={ariaLabel}
      className={cx("flow-section", className)}
      style={style}
    >
      <div className="flow-art-container">{children}</div>
    </section>
  );
}

export default function FlowArt({
  children,
  className,
  "aria-label": ariaLabel = "Story scroll",
}) {
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root || reducedMotion) return;

      const sections = Array.from(
        root.querySelectorAll("[data-flow-section]"),
      );
      if (!sections.length) return;

      const triggers = [];

      sections.forEach((section, index) => {
        const inner = section.querySelector(".flow-art-container");
        if (!inner) return;

        gsap.set(section, { zIndex: index + 1 });

        if (index > 0) {
          gsap.set(inner, { rotation: 12, transformOrigin: "bottom left" });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 25%",
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (index < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: "bottom bottom",
              end: "bottom top",
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();
      return () => triggers.forEach((trigger) => trigger.kill());
    },
    {
      scope: containerRef,
      dependencies: [Children.count(children), reducedMotion],
    },
  );

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx("flow-art", className)}
    >
      {children}
    </main>
  );
}
