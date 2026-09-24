import Button from "./button";
import { navigate } from "@/lib/router";

export default function HorizonHero({ actions = [] }) {
  return (
    <section className="horizon-hero" aria-label="CampusFlow introduction">
      <div className="hero-grid">
        <div className="hero-copy horizon-copy">
          <p className="eyebrow">CampusFlow / your campus, in motion</p>
          <h1>
            Everything
            <br />
            <em>in rhythm.</em>
          </h1>
          <p>
            One composed workspace for the classes, people, progress, and
            opportunities that shape your day.
          </p>
          <div className="hero-actions">
            {actions.map((action, index) => (
              <Button
                className={index === 1 ? "hero-secondary-button" : undefined}
                key={action.label}
                onClick={() => navigate(action.route)}
                variant={action.variant}
              >
                {action.label} <span aria-hidden="true">↗</span>
              </Button>
            ))}
          </div>
          <div className="hero-proof">
            <span>01</span>
            <i />
            <b>Designed for every role on campus</b>
          </div>
        </div>
        <div className="hero-stage" aria-label="CampusFlow dashboard preview">
          <div className="hero-orbit orbit-large" />
          <div className="hero-orbit orbit-small" />
          <div className="hero-card hero-card-main">
            <div className="hero-card-top">
              <span>MONDAY / 08:42</span>
              <b>Good morning, A.</b>
            </div>
            <div className="hero-card-line">
              <i />
              <span>Today&apos;s flow</span>
              <strong>04</strong>
            </div>
            <div className="hero-card-task">
              <small>NEXT UP</small>
              <b>Data structures</b>
              <span>09:00 · Room 204</span>
            </div>
          </div>
          <div className="hero-card hero-card-float">
            <span>ATTENDANCE</span>
            <strong>92%</strong>
            <i>+4% this month</i>
          </div>
          <div className="hero-stage-label">
            A clearer day starts here <span>↗</span>
          </div>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll to explore</span>
        <i />
        <b>01 — 03</b>
      </div>
    </section>
  );
}
