import { colorPalettes, heroActions } from "@/common";
import { navigate } from "@/lib/router";
import { useCampusStore } from "@/lib/useCampusStore";
import Button from "./ui/button";
import FlowArt, { FlowSection } from "./ui/story-scroll";
import HorizonHero from "./ui/horizon-hero-section";
import StackingCards, { StackingCardItem } from "./ui/stacking-cards";

export default function Home() {
  const experienceCards = useCampusStore((state) => state.experienceCards);
  const storySections = useCampusStore((state) => state.storySections);
  const features = useCampusStore((state) => state.features);

  return (
    <>
      <div id="top" />
      <HorizonHero actions={heroActions} />

      <section className="stacking-section" id="experience">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Designed around campus life</p>
            <h2>Everything connected.<br />Nothing overwhelming.</h2>
          </div>
          <div>
            <p>
              Scroll through the moments CampusFlow keeps close, from the first
              class of the day to the opportunity waiting after it.
            </p>
            <Button onClick={() => navigate("/signup")}>Join CampusFlow</Button>
          </div>
        </div>

        <StackingCards
          className="stacking-track"
          totalCards={experienceCards.length}
          scaleMultiplier={0.025}
          aria-label="CampusFlow experience cards"
        >
          {experienceCards.map((card, index) => (
            <StackingCardItem
              className="stacking-card-frame"
              index={index}
              key={card.title}
            >
              <article
                className="stacking-card"
                style={{
                  "--card-bg": colorPalettes.bigCardThemes[index].background,
                  "--card-shadow": colorPalettes.bigCardThemes[index].shadow,
                  "--card-text": colorPalettes.bigCardThemes[index].text,
                  "--card-muted": colorPalettes.bigCardThemes[index].muted,
                  "--card-accent": colorPalettes.bigCardThemes[index].accent,
                }}
              >
                <div className="stacking-card-copy">
                  <p className="stacking-card-eyebrow">
                    {card.eyebrow} / 0{index + 1}
                  </p>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                    Open your workspace <span aria-hidden="true">↗</span>
                  </Button>
                </div>
                <div className="stacking-card-image">
                  <img
                    src={card.image}
                    alt=""
                    width="800"
                    height="600"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </article>
            </StackingCardItem>
          ))}
        </StackingCards>
      </section>

      <FlowArt className="landing-story" aria-label="The CampusFlow story">
        {storySections.map((section, index) => (
          <FlowSection
            aria-label={section.label}
            key={section.number}
            style={{
              backgroundColor: colorPalettes.storyCardThemes[index].background,
              color: colorPalettes.storyCardThemes[index].text,
              "--story-accent": colorPalettes.storyCardThemes[index].accent,
              "--story-rule": colorPalettes.storyCardThemes[index].rule,
              "--story-muted": colorPalettes.storyCardThemes[index].muted,
              "--story-button-text": colorPalettes.storyCardThemes[index].buttonText,
            }}
          >
            <p className="story-kicker">{section.number} — {section.label}</p>
            <hr className="story-rule" />
            <h2>
              {section.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <hr className="story-rule" />
            <div className="story-bottom">
              <p>{section.copy}</p>
              {section.stats && (
                <div className="story-stats">
                  {section.stats.map(([title, copy]) => (
                    <div key={title}>
                      <strong>{title}</strong>
                      <p>{copy}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {index === storySections.length - 1 && (
              <Button onClick={() => navigate("/signup")}>
                Find your place <span aria-hidden="true">↗</span>
              </Button>
            )}
          </FlowSection>
        ))}
      </FlowArt>

      <section className="features-section" id="features" aria-labelledby="features-title">
        <div className="features-heading">
          <div>
            <p className="eyebrow">Website features</p>
            <h2 id="features-title">Everything campus life needs.</h2>
          </div>
          <p>
            One connected platform for academic work, campus communication,
            progress, and opportunity.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => {
            const theme = colorPalettes.cardThemes[feature.theme];
            return (
              <article
                className="feature-card"
                key={feature.title}
                style={{
                  "--feature-bg": theme.background,
                  "--feature-shadow": theme.shadow,
                  "--feature-text": theme.text,
                  "--feature-muted": theme.muted,
                  "--feature-accent": theme.accent,
                }}
              >
                <span>{feature.meta}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
