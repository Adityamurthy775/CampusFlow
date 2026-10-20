import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, MoveRight } from "lucide-react";
import { navigate } from "@/lib/router";
import dashboard from "@/assets/dashboard.png";

const rotatingWords = ["classes", "deadlines", "drives", "placements", "campus life"];
const highlights = ["Unified dashboard", "Role-based access", "Placement tracker"];
const audiences = ["Students", "Faculty", "Leadership", "Placement cell", "Clubs"];

export default function Hero() {
  const [word, setWord] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setWord((v) => (v + 1) % rotatingWords.length), 2000);
    return () => clearTimeout(id);
  }, [word]);

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-background">
      {/* Pale blue diagonal wash — Smart Placement Tracker hero ground. No shadows anywhere. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:linear-gradient(135deg,#f6faff_10%,#dceafd_35%,#a9c9ea_65%,#7f9dc4_92%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col items-center gap-7 py-24 text-center lg:py-28">
        <button
          type="button"
          onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
        >
          CampusFlow is live for 2026
          <MoveRight className="h-4 w-4" />
        </button>
        <h1 className="max-w-4xl font-heading text-5xl font-bold tracking-tighter text-foreground md:text-6xl lg:text-7xl">
          <span className="block">One calm home for your</span>
          <span className="relative flex min-h-[1.2em] w-full justify-center overflow-hidden pb-2 pt-1">
            &nbsp;
            {rotatingWords.map((title, index) => (
              <motion.span
                key={`${title}-${index}`}
                className="absolute whitespace-nowrap font-bold text-primary"
                initial={{ opacity: 0, y: -100 }}
                transition={{ type: "spring", stiffness: 50 }}
                animate={
                  word === index
                    ? { y: 0, opacity: 1 }
                    : { y: word > index ? -150 : 150, opacity: 0 }
                }
              >
                {title}
              </motion.span>
            ))}
          </span>
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground md:text-xl">
          CampusFlow keeps students, faculty, and placement teams in one focused
          workspace — classes, deadlines, announcements, and placements, connected.
        </p>
        {/* Check chips — SPT highlight row */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-base text-muted-foreground">
          {highlights.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 transition hover:border-primary hover:text-foreground"
            >
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {item}
            </span>
          ))}
        </div>

        {/* CTAs — accent fill + outline pill pairing (SPT pairing) */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent/90"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card px-8 py-4 font-semibold text-foreground transition hover:bg-secondary"
          >
            Sign in
          </button>
        </div>

        {/* Audience wordmark strip */}
        <div className="mt-2 w-full max-w-4xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Built for every corner of campus
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {audiences.map((name) => (
              <span
                key={name}
                className="font-heading text-lg font-bold text-muted-foreground transition hover:text-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
        {/* Dashboard preview — white frame, hairline border, no shadow */}
        <div className="mt-6 w-full max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-secondary bg-card p-2">
            <img
              src={dashboard}
              alt="CampusFlow dashboard preview"
              className="h-auto w-full rounded-xl"
              loading="eager"
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
