import {
  createContext,
  useContext,
  useRef,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

const StackingCardsContext = createContext(null);

export default function StackingCards({
  children,
  className,
  scrollOptions,
  scaleMultiplier,
  totalCards,
  ...props
}) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    ...scrollOptions,
    target: targetRef,
  });

  return (
    <StackingCardsContext.Provider
      value={{ progress: scrollYProgress, scaleMultiplier, totalCards }}
    >
      <div ref={targetRef} className={cn(className)} {...props}>
        {children}
      </div>
    </StackingCardsContext.Provider>
  );
}

export function StackingCardItem({
  index,
  topPosition,
  className,
  children,
  ...props
}) {
  const context = useStackingCardsContext();
  const reducedMotion = useReducedMotion();
  const { progress, scaleMultiplier, totalCards = 0 } = context;
  const cardCount = Math.max(totalCards, 1);
  const scaleTo = 1 - (cardCount - index - 1) * (scaleMultiplier ?? 0.03);
  const scale = useTransform(progress, [index / cardCount, 1], [1, scaleTo]);
  const top = topPosition ?? `${7 + index * 3}%`;

  return (
    <div className={cn("stacking-card-frame", className)} {...props}>
      <motion.div
        className="stacking-card-motion"
        style={{ top, scale: reducedMotion ? 1 : scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function useStackingCardsContext() {
  const context = useContext(StackingCardsContext);
  if (!context) {
    throw new Error("StackingCardItem must be used within StackingCards");
  }
  return context;
}
