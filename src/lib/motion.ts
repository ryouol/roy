export const motionConfig = {
  effects: { smooth: true },
  desktop: "(min-width: 800px) and (min-height: 600px)",
  motionAllowed: "(prefers-reduced-motion: no-preference)",
  lenis: { lerp: 0.085, wheelMultiplier: 0.85 },
} as const;
