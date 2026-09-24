/**
 * Glyph Portal © 2026 Christian Katzmann. MIT.
 * Origin: UsefulPortal.astro on https://ktzm.dk → UsefulPortal.tsx → ClarityPortal.tsx.
 * A scroll-driven camera through live type. Keep this notice with copies.
 */
import { useId, useLayoutEffect, useRef } from "react";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (start, end, value) => {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
};
const DEFAULT_FONT = '"Arial Black", Arial, sans-serif';

function interior(context, character, font) {
  const canvas = context.canvas;
  context.font = font;
  const metrics = context.measureText(character);
  const padding = 8;
  const left = Math.ceil(metrics.actualBoundingBoxLeft);
  const ascent = Math.ceil(metrics.actualBoundingBoxAscent);
  canvas.width = Math.max(
    1,
    Math.ceil(metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight) +
      padding * 2,
  );
  canvas.height = Math.max(
    1,
    Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) +
      padding * 2,
  );
  context.font = font;
  context.fontKerning = "none";
  context.fillText(character, padding + left, padding + ascent);
  const { width, height } = canvas;
  const pixels = context.getImageData(0, 0, width, height).data;
  const rows = new Uint16Array(width + 1);
  let size = 0;
  let boxX = 0;
  let boxY = 0;
  for (let y = 0; y < height; y += 1) {
    let diagonal = 0;
    for (let x = 0; x < width; x += 1) {
      const above = rows[x + 1];
      rows[x + 1] =
        pixels[(y * width + x) * 4 + 3] > 245
          ? Math.min(above, rows[x], diagonal) + 1
          : 0;
      diagonal = above;
      if (rows[x + 1] > size) {
        size = rows[x + 1];
        boxX = x;
        boxY = y;
      }
    }
  }
  if (size < 3) return null;
  return {
    x: (boxX + 1 - size / 2 - padding - left) / 3,
    y: (boxY + 1 - size / 2 - padding - ascent) / 3,
    radius: (size / 2 - 1) / 3,
  };
}

function scrollParent(element) {
  for (
    let parent = element.parentElement;
    parent;
    parent = parent.parentElement
  ) {
    if (
      /(auto|scroll|hidden)/.test(getComputedStyle(parent).overflowY) &&
      parent !== document.body &&
      parent !== document.documentElement
    ) {
      return parent;
    }
  }
  return null;
}

export default function GlyphPortal({
  word = "SUBLIME",
  focusChar,
  interactive = true,
  background,
  front,
  children,
  scrollLength = 2.4,
  fontFamily = DEFAULT_FONT,
  fontWeight = 900,
  annotations = false,
  enterLabel = "Enter section",
  className,
  style,
  onProgress,
}) {
  const uid = `gp-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const clipId = `${uid}-clip`;
  const sectionRef = useRef(null);
  const progressRef = useRef(onProgress);
  useLayoutEffect(() => {
    progressRef.current = onProgress;
  }, [onProgress]);

  const text = word.trim().normalize("NFC") || "SUBLIME";
  const characters = Array.from(text).map((character, index, values) => ({
    character,
    index: values.slice(0, index).join("").length,
  }));
  const length = Number.isFinite(scrollLength) ? clamp(scrollLength, 1, 8) : 2.4;
  const weight = Number.isFinite(fontWeight) ? clamp(fontWeight, 1, 1000) : 900;
  const hasFront = front != null;
  const query = `:where(#${uid})`;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = section.querySelector("[data-gp-pin]");
    const field = section.querySelector("[data-gp-field]");
    const art = section.querySelector("[data-gp-art]");
    const clip = section.querySelector(`#${clipId}`);
    const glyph = section.querySelector("[data-gp-glyph]");
    const marks = section.querySelector("[data-gp-marks]");
    const choices = section.querySelector("[data-gp-choices]");
    const buttons = Array.from(choices.querySelectorAll("button"));
    const picker = section.querySelector("[data-gp-select]");
    const root = scrollParent(section);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    let disposed = false;
    let raf = 0;
    let dirty = true;
    let active = true;
    let ready = false;
    const mountedAt = performance.now();
    let browserFrameSeen = false;
    let stalled = false;
    let width = 1;
    let height = 1;
    let travel = 1;
    let startScale = 1;
    let endScale = 1;
    let center = { x: 0, y: 0 };
    let target = null;
    let lastProgress = -1;
    let candidates = [];
    let letters = [];
    let choosing = false;
    let bounds = { x: 0, y: 0, width: 1, height: 1 };
    let fontDirty = true;

    glyph.style.fontFamily = fontFamily;
    const computedFamily = getComputedStyle(glyph).fontFamily;
    const families =
      computedFamily.match(/(?:[^,"']+|"[^"]*"|'[^']*')+/g) || [];
    const available = families.filter((family) => {
      try {
        return document.fonts.check(
          `${weight} 100px ${family.trim()}`,
          text,
        );
      } catch {
        return false;
      }
    });
    glyph.style.fontFamily = [...available, DEFAULT_FONT].join(",");
    stalled = available.length < families.length;

    const readInk = () => {
      if (!context) return false;
      const font = getComputedStyle(glyph);
      const scanFont = `${font.fontWeight} 300px ${font.fontFamily}`;
      context.font = `${font.fontWeight} 100px ${font.fontFamily}`;
      context.fontKerning = "none";
      const metrics = context.measureText(text);
      const advances = Array.from({ length: text.length }, (_, index) =>
        context.measureText(text.slice(0, index)).width,
      );
      bounds = {
        x: -metrics.actualBoundingBoxLeft,
        y: -metrics.actualBoundingBoxAscent,
        width:
          metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
        height:
          metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
      };
      if (!bounds.width || !bounds.height) return false;
      center = {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2,
      };
      const requested = focusChar
        ? text.indexOf(focusChar.normalize("NFC"))
        : -1;
      let offset = 0;
      candidates = [];
      letters = [];
      for (const character of Array.from(text)) {
        context.font = `${font.fontWeight} 100px ${font.fontFamily}`;
        const characterMetrics = context.measureText(character);
        letters.push({
          index: offset,
          x:
            advances[offset] -
            characterMetrics.actualBoundingBoxLeft,
          y: -characterMetrics.actualBoundingBoxAscent,
          width:
            characterMetrics.actualBoundingBoxLeft +
            characterMetrics.actualBoundingBoxRight,
          height:
            characterMetrics.actualBoundingBoxAscent +
            characterMetrics.actualBoundingBoxDescent,
        });
        const found = interior(context, character, scanFont);
        if (found) {
          candidates.push({
            ...found,
            x: found.x + advances[offset],
            index: offset,
          });
        }
        offset += character.length;
      }
      target =
        candidates.find((candidate) => candidate.index === requested) ||
        [...candidates].sort(
          (first, second) =>
            second.radius - first.radius ||
            Math.abs(first.x - center.x) - Math.abs(second.x - center.x),
        )[0] ||
        null;
      return true;
    };

    const select = (next) => {
      target = next;
      endScale = target
        ? Math.max(
            startScale,
            Math.hypot(width, height) / (target.radius * 1.35),
          )
        : startScale;
      section.dataset.gpFocus = target
        ? Array.from(text.slice(target.index))[0]
        : "";
      section.dataset.gpFocusIndex = String(target?.index ?? -1);
      for (const button of buttons) {
        const selected = Number(button.dataset.gpLetter) === target?.index;
        button.disabled = !candidates.some(
          (candidate) => candidate.index === Number(button.dataset.gpLetter),
        );
        button.setAttribute("aria-checked", String(selected));
        button.tabIndex = selected ? 0 : -1;
      }
      if (picker.value !== "") picker.value = String(target?.index ?? -1);
      for (const option of Array.from(picker.options)) {
        option.disabled =
          option.value === "" ||
          !candidates.some(
            (candidate) => candidate.index === Number(option.value),
          );
      }
      const unit = 1 / startScale;
      const y = bounds.y + bounds.height + 25 * unit;
      const x = bounds.x;
      const right = x + bounds.width;
      const cross = target
        ? `M${target.x - 9 * unit} ${target.y}h${18 * unit}M${target.x} ${
            target.y - 9 * unit
          }v${18 * unit}`
        : "";
      const annotationPath = marks.querySelector("path");
      annotationPath.setAttribute(
        "d",
        `M${x} ${y}H${right}M${x} ${y - 5 * unit}v${10 * unit}M${right} ${
          y - 5 * unit
        }v${10 * unit}${cross}`,
      );
      annotationPath.setAttribute("stroke-width", String(unit));
    };

    const position = () => {
      const origin = root
        ? root.getBoundingClientRect().top + root.clientTop
        : 0;
      return clamp(
        (origin - section.getBoundingClientRect().top) / travel,
      );
    };

    const paint = (progress) => {
      const isStatic =
        motion.matches || !browserFrameSeen || stalled || !target;
      const current = isStatic ? 0 : progress;
      const transition = clamp(current / 0.78);
      const eased =
        transition < 0.5
          ? 4 * transition ** 3
          : 1 - (-2 * transition + 2) ** 3 / 2;
      const scale = Math.exp(
        Math.log(startScale) +
          Math.log(endScale / startScale) * eased,
      );
      const blend =
        endScale === startScale
          ? 0
          : (1 / scale - 1 / startScale) /
            (1 / endScale - 1 / startScale);
      const cameraX = center.x + ((target?.x ?? center.x) - center.x) * blend;
      const cameraY = center.y + ((target?.y ?? center.y) - center.y) * blend;
      const roll =
        -4 *
        smooth(0.06, 0.5, transition) *
        (1 - smooth(0.62, 0.92, transition));
      const transform = `translate(${width / 2} ${
        height * 0.46 +
        height * 0.04 * eased
      }) scale(${scale}) rotate(${roll}) translate(${-cameraX} ${-cameraY})`;
      const radians = (roll * Math.PI) / 180;
      const dx = width / 2 / scale;
      const dy = (height * 0.46 + height * 0.04 * eased) / scale;
      clip.setAttribute(
        "transform",
        `scale(${scale}) rotate(${roll})`,
      );
      glyph.setAttribute(
        "transform",
        `translate(${Math.cos(radians) * dx + Math.sin(radians) * dy - cameraX} ${
          -Math.sin(radians) * dx +
          Math.cos(radians) * dy -
          cameraY
        })`,
      );
      marks.setAttribute("transform", transform);
      marks.style.opacity = String(1 - smooth(0.015, 0.17, current));
      choosing = interactive && !isStatic && current < 0.04;
      choices.inert = !choosing;
      section.dataset.gpChoosing = String(choosing);
      field.style.clipPath =
        transition >= 1 ? "none" : `url(#${clipId})`;
      section.style.setProperty(
        "--gp-caption",
        String(1 - smooth(0.01, 0.16, current)),
      );
      section.style.setProperty(
        "--gp-reveal",
        String(isStatic ? 1 : smooth(0.78, 0.9, current)),
      );
      section.style.setProperty(
        "--gp-field-scale",
        String(1 + 0.16 * smooth(0, 0.82, current)),
      );
      section.style.setProperty(
        "--gp-caption-hit",
        current < 0.08 ? "auto" : "none",
      );
      section.dataset.gpEntered = String(current >= 0.9);
      section.dataset.gpProgress = current.toFixed(5);
      if (current !== lastProgress) {
        lastProgress = current;
        progressRef.current?.(current);
      }
    };

    const layout = () => {
      if (!section.clientWidth) return;
      width = pin.clientWidth;
      const smallViewport = section.querySelector(
        "[data-gp-viewport]",
      ).offsetHeight;
      const viewportHeight = Math.max(
        1,
        Math.min(root?.clientHeight ?? smallViewport, smallViewport),
      );
      height = motion.matches
        ? Math.min(viewportHeight * 0.75, 480)
        : viewportHeight;
      section.style.setProperty("--gp-height", `${height}px`);
      travel = height * length;
      art.setAttribute("viewBox", `0 0 ${width} ${height}`);
      if (fontDirty) {
        ready = readInk();
        fontDirty = false;
      }
      if (!ready) return;
      const wordHeight =
        hasFront && height < 480
          ? Math.min(height * 0.38, Math.max(24, height - 264))
          : height * 0.38;
      startScale = Math.min(
        (width * 0.84) / bounds.width,
        wordHeight / bounds.height,
      );
      select(target);
      for (const button of buttons) {
        const letter = letters.find(
          (item) => item.index === Number(button.dataset.gpLetter),
        );
        Object.assign(button.style, {
          left: `${
            width / 2 + (letter.x - center.x) * startScale
          }px`,
          top: `${
            height * 0.46 +
            (letter.y - center.y) * startScale -
            Math.max(0, 44 - letter.height * startScale) / 2
          }px`,
          width: `${Math.max(1, letter.width * startScale)}px`,
          height: `${Math.max(44, letter.height * startScale)}px`,
        });
      }
      section.style.setProperty(
        "--gp-word-top",
        `${height * 0.46 - (bounds.height * startScale) / 2}px`,
      );
      section.style.setProperty(
        "--gp-word-bottom",
        `${height * 0.46 + (bounds.height * startScale) / 2}px`,
      );
      section.dataset.gpReady = "true";
      section.dataset.gpMotion =
        !motion.matches && browserFrameSeen && !stalled && target
          ? "on"
          : "off";
    };

    const frame = (time) => {
      raf = 0;
      if (disposed) return;
      if (time !== undefined && !browserFrameSeen) {
        browserFrameSeen = true;
        stalled ||= performance.now() - mountedAt > 2500;
        dirty = true;
      }
      if (dirty) {
        dirty = false;
        layout();
      }
      if (ready) paint(position());
    };
    const schedule = () => {
      if (!raf && active) raf = requestAnimationFrame(frame);
    };
    const resize = () => {
      cancelAnimationFrame(raf);
      dirty = true;
      frame();
    };
    const scroll = () => schedule();
    const choose = (event) => {
      if (!choosing || position() >= 0.04) return;
      const button = event.target.closest("[data-gp-letter]");
      const next = candidates.find(
        (candidate) => candidate.index === Number(button?.dataset.gpLetter),
      );
      if (!next || next === target) return;
      select(next);
      paint(position());
    };
    const navigateLetters = (event) => {
      if (
        !choosing ||
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ].includes(event.key)
      ) {
        return;
      }
      event.preventDefault();
      const current = candidates.indexOf(target);
      const index =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? candidates.length - 1
            : (current +
                (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1) +
                candidates.length) %
              candidates.length;
      buttons
        .find(
          (button) =>
            Number(button.dataset.gpLetter) === candidates[index].index,
        )
        ?.focus({ preventScroll: true });
    };
    const pick = () => {
      if (!choosing || position() >= 0.04) return;
      const next = candidates.find(
        (candidate) => candidate.index === Number(picker.value),
      );
      if (next) {
        select(next);
        paint(position());
      }
    };

    choices.addEventListener("pointerover", choose);
    choices.addEventListener("click", choose);
    choices.addEventListener("focusin", choose);
    choices.addEventListener("keydown", navigateLetters);
    picker.addEventListener("change", pick);
    const observer = new ResizeObserver(resize);
    observer.observe(section);
    if (root) observer.observe(root);
    const visibility = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) {
          dirty = true;
          schedule();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { root, rootMargin: "100% 0px" },
    );
    visibility.observe(section);
    (root || window).addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    motion.addEventListener("change", resize);
    frame();
    schedule();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      visibility.disconnect();
      (root || window).removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      motion.removeEventListener("change", resize);
      choices.removeEventListener("pointerover", choose);
      choices.removeEventListener("click", choose);
      choices.removeEventListener("focusin", choose);
      choices.removeEventListener("keydown", navigateLetters);
      picker.removeEventListener("change", pick);
    };
  }, [text, focusChar, interactive, fontFamily, weight, length, clipId, hasFront]);

  return (
    <section
      ref={sectionRef}
      id={uid}
      className={className}
      aria-label={text}
      style={{
        "--gp-length": length,
        "--gp-characters": Array.from(text).length,
        ...style,
      }}
    >
      <style>{`
        ${query}{--gp-paper:#fff;--gp-ink:#0c1212;--gp-field:#0b3b2a;--gp-foreground:#fbfbfa;position:relative;isolation:isolate;background:var(--gp-paper);color:var(--gp-ink);font-family:Arial,sans-serif;}
        ${query}>[data-gp-viewport]{position:absolute;inset:0 auto auto 0;height:100vh;height:100svh;width:0;pointer-events:none;visibility:hidden;}
        ${query} [data-gp-pin]{position:relative;height:var(--gp-height,100svh);overflow:clip;isolation:isolate;container-type:size;}
        ${query} [data-gp-field]{position:absolute;inset:0;background:var(--gp-field);opacity:0;pointer-events:none;}
        ${query}[data-gp-ready] [data-gp-field]{opacity:1;}
        ${query} [data-gp-art]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;}
        ${query} [data-gp-marks]{fill:none;stroke:var(--gp-ink);opacity:.6;}
        ${query} [data-gp-choices]{position:absolute;inset:0;visibility:hidden;pointer-events:none;}
        ${query}[data-gp-choosing=true] [data-gp-choices]{visibility:visible;}
        ${query} [data-gp-letter]{box-sizing:border-box;position:absolute;border:0;padding:0;margin:0;background:transparent;cursor:pointer;pointer-events:auto;touch-action:pan-y;}
        ${query} [data-gp-letter]:disabled{pointer-events:none;}
        ${query} [data-gp-letter]:focus-visible{outline:2px solid var(--gp-field);outline-offset:5px;}
        ${query} [data-gp-touch-picker]{display:none;position:absolute;top:calc(var(--gp-word-bottom,50%) + 42px);left:50%;transform:translateX(-50%);font:12px/1.4 Arial,sans-serif;align-items:center;gap:12px;visibility:hidden;}
        ${query}[data-gp-choosing=true] [data-gp-touch-picker]{visibility:visible;}
        ${query} [data-gp-select]{min-height:44px;min-width:90px;border:1px solid #d8deda;border-radius:4px;background:var(--gp-paper);color:var(--gp-ink);padding:0 10px;font:inherit;}
        ${query} [data-gp-select]:focus-visible{outline:2px solid var(--gp-field);outline-offset:4px;}
        @media(any-pointer:coarse){${query} [data-gp-touch-picker]{display:flex;}}
        ${query} [data-gp-fallback]{position:absolute;inset:0;display:none;place-items:center;font-size:min(calc(100cqw / var(--gp-characters)),38cqh);line-height:1;color:var(--gp-field);}
        ${query}[data-gp-ready] [data-gp-fallback]{visibility:hidden;}
        ${query} [data-gp-caption]{position:absolute;inset:auto 8% 9%;display:flex;align-items:center;justify-content:space-between;gap:1rem;font:12px/1.4 Arial,sans-serif;opacity:var(--gp-caption,1);pointer-events:var(--gp-caption-hit,auto);}
        ${query} [data-gp-front]{position:absolute;inset:0;opacity:var(--gp-caption,1);pointer-events:none;}
        ${query} [data-gp-front] a,${query} [data-gp-front] button{pointer-events:var(--gp-caption-hit,auto);}
        ${query} [data-gp-front]:focus-within{opacity:1;}
        ${query} [data-gp-hint]{max-width:30ch;color:var(--gp-ink);}
        ${query} [data-gp-enter]{display:inline-flex;align-items:center;gap:16px;min-height:44px;color:inherit;font:inherit;text-decoration:none;letter-spacing:inherit;}
        ${query} [data-gp-enter]:focus-visible{outline:2px solid currentColor;outline-offset:5px;}
        ${query} [data-gp-content]{box-sizing:border-box;position:relative;min-height:var(--gp-height,100svh);padding:clamp(32px,7%,100px);display:grid;align-content:center;color:var(--gp-foreground);background:var(--gp-field);overflow-wrap:anywhere;}
        ${query}[data-gp-motion=on] [data-gp-pin]{position:sticky;top:0;}
        ${query}[data-gp-motion=off] [data-gp-hint]{display:none;}
        ${query}[data-gp-motion=on] [data-gp-content]{margin-top:calc((var(--gp-length) - 1) * var(--gp-height));background:transparent;opacity:var(--gp-reveal,0);pointer-events:none;}
        ${query}[data-gp-motion=on][data-gp-entered=true] [data-gp-content]{pointer-events:auto;}
        ${query}[data-gp-motion=on]:has([data-gp-content]:focus-within) [data-gp-field]{clip-path:none!important;}
        ${query}[data-gp-motion=on] [data-gp-content]:focus-within{opacity:1;pointer-events:auto;}
        ${query}:has([data-gp-content]:focus-within) [data-gp-caption],${query}:has([data-gp-content]:focus-within) [data-gp-marks]{opacity:0;}
        ${query} [data-gp-default-title]{color:inherit;font:400 clamp(32px,5vw,72px)/1.05 Georgia,serif;letter-spacing:-.035em;max-width:13ch;margin:0 0 24px;text-wrap:balance;}
        ${query} [data-gp-default-copy]{color:inherit;font:16px/1.6 Arial,sans-serif;max-width:36ch;margin:0;}
        @media(prefers-reduced-motion:reduce){${query} [data-gp-pin]{position:relative!important;} ${query} [data-gp-content]{margin-top:0!important;opacity:1!important;background:var(--gp-field)!important;min-height:0;padding-block:64px;} ${query} [data-gp-caption]{opacity:1!important;}}
        @media(prefers-reduced-motion:reduce){${query} [data-gp-hint]{display:none;}}
      `}</style>
      <noscript>
        <style>{`${query} [data-gp-fallback]{display:grid}${query} [data-gp-hint]{display:none}`}</style>
      </noscript>
      <div data-gp-viewport aria-hidden="true" />
      <div data-gp-pin>
        <div data-gp-field aria-hidden="true" inert>
          {background || (
            <div
              data-gp-default-field
              style={{
                position: "absolute",
                inset: 0,
                transform: "scale(var(--gp-field-scale,1))",
                background:
                  "radial-gradient(circle at 18% 8%, rgba(242,193,78,.48), transparent 34%), radial-gradient(circle at 82% 20%, rgba(255,255,255,.12), transparent 28%), radial-gradient(circle at 48% 78%, rgba(44,107,77,.55), transparent 44%), linear-gradient(135deg,#003049 0%,#2c6b4d 52%,#780000 100%)",
              }}
            />
          )}
        </div>
        <svg data-gp-art aria-hidden="true" focusable="false">
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <text
                data-gp-glyph
                x="0"
                y="0"
                style={{
                  fontFamily,
                  fontWeight: weight,
                  fontSize: 100,
                  fontKerning: "none",
                  fontVariantLigatures: "none",
                  letterSpacing: 0,
                }}
              >
                {text}
              </text>
            </clipPath>
          </defs>
          <g
            data-gp-marks
            style={{ visibility: annotations ? "visible" : "hidden" }}
          >
            <path />
          </g>
        </svg>
        <div
          data-gp-choices
          role="radiogroup"
          aria-label="Choose the letter to enter through"
          inert
        >
          {characters.map(({ character, index }, characterIndex) => (
            <button
              type="button"
              role="radio"
              aria-checked="false"
              tabIndex={-1}
              data-gp-letter={index}
              key={index}
              aria-label={`${character}, letter ${characterIndex + 1} of ${characters.length}`}
            />
          ))}
        </div>
        <label data-gp-touch-picker>
          <span
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clipPath: "inset(50%)",
            }}
          >
            Entry letter
          </span>
          <select data-gp-select defaultValue="">
            <option value="" disabled>
              Choose a letter
            </option>
            {characters.map(({ character, index }, characterIndex) => (
              <option value={index} key={index}>
                {characterIndex + 1} · {character}
              </option>
            ))}
          </select>
        </label>
        {front && <div data-gp-front>{front}</div>}
        <span
          data-gp-fallback
          aria-hidden="true"
          style={{ fontFamily, fontWeight: weight }}
        >
          {text}
        </span>
        <div data-gp-caption>
          <span data-gp-hint aria-hidden="true">
            {interactive
              ? "Choose a letter, then scroll."
              : annotations
                ? "A passage through type"
                : ""}
          </span>
          <a data-gp-enter href={`#${uid}-content`}>
            {enterLabel}
            <span aria-hidden="true">↘</span>
          </a>
        </div>
      </div>
      <div data-gp-content id={`${uid}-content`} tabIndex={-1}>
        {children || (
          <div>
            <h2 data-gp-default-title>A letter becomes a place.</h2>
            <p data-gp-default-copy>
              The shape opens onto whatever comes next.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
