import { useEffect, useState } from "react";

export default function GlyphPortalPreloader({ onComplete }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const begin = window.setTimeout(
      () => setLeaving(true),
      reducedMotion ? 0 : 1550,
    );
    const finish = window.setTimeout(
      () => {
        onComplete?.();
      },
      reducedMotion ? 180 : 2100,
    );

    return () => {
      window.clearTimeout(begin);
      window.clearTimeout(finish);
    };
  }, [onComplete]);

  return (
    <div
      aria-hidden="true"
      className={`portal-preloader ${leaving ? "is-leaving" : ""}`}
    >
      <div className="portal-preloader-word">
        {"CAMPUSFLOW".split("").map((character, index) => (
          <span
            key={`${character}-${index}`}
            style={{ "--portal-index": index }}
          >
            {character}
          </span>
        ))}
      </div>
      <p>Small actions. Real impact.</p>
    </div>
  );
}
