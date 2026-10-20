import { ArrowUpRight } from "lucide-react";
import { navigate } from "@/lib/router";
import Hero from "./ui/hero-01";
import BentoFeatures from "./ui/bento-features-demo";
import { Navigation } from "./ui/saa-s-template";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div id="top" />
      <Hero />
      <section id="features" className="section-wash px-6 py-24">
        <BentoFeatures />
      </section>
      <section id="join" className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-secondary bg-card p-8 text-center sm:p-12 lg:p-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-secondary bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground">
            Ready when you are
          </p>
          <h2 className="mt-6 font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
            Bring your campus into one calm view
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Classes, deadlines, announcements, and placements — connected in one
            place, so nothing slips through the day.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 font-semibold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent/90"
            >
              Join CampusFlow
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full border border-primary/40 bg-card px-8 py-4 font-semibold text-foreground transition hover:bg-secondary"
            >
              Sign in
            </button>
          </div>
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-border pt-8">
            {[["3", "views, one login"], ["24/7", "campus access"], ["1", "calm workspace"], ["0", "scattered tabs"]].map(([n, l]) => (
              <span key={l} className="text-sm text-muted-foreground">
                <b className="font-heading text-xl font-bold text-foreground">{n}</b> {l}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
