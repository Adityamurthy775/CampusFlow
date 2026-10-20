const cardStudioPalette = {
  punchRed: {
    DEFAULT: "#e63946",
    100: "#33060a",
    200: "#660d14",
    300: "#99131e",
    400: "#cb1928",
    500: "#e63946",
    600: "#eb5f6b",
    700: "#f08790",
    800: "#f5afb5",
    900: "#fad7da",
  },
  honeydew: {
    DEFAULT: "#f1faee",
    100: "#234c16",
    200: "#47982c",
    300: "#75ce57",
    400: "#b4e4a3",
    500: "#f1faee",
    600: "#f5fbf2",
    700: "#f7fcf6",
    800: "#fafdf9",
    900: "#fcfefc",
  },
  frostedBlue: {
    DEFAULT: "#a8dadc",
    100: "#163637",
    200: "#2c6d6f",
    300: "#42a3a6",
    400: "#70c3c6",
    500: "#a8dadc",
    600: "#b9e2e3",
    700: "#cae9ea",
    800: "#dcf0f1",
    900: "#edf8f8",
  },
  cerulean: {
    DEFAULT: "#457b9d",
    100: "#0e181f",
    200: "#1b313e",
    300: "#29495e",
    400: "#37627d",
    500: "#457b9d",
    600: "#6097b9",
    700: "#88b1cb",
    800: "#b0cbdc",
    900: "#d7e5ee",
  },
  oxfordNavy: {
    DEFAULT: "#1d3557",
    100: "#060b12",
    200: "#0c1623",
    300: "#122035",
    400: "#172b46",
    500: "#1d3557",
    600: "#315a93",
    700: "#4e7fc4",
    800: "#89aad8",
    900: "#c4d4eb",
  },
};

const scaleGradient = (scale) =>
  `linear-gradient(145deg, ${scale[100]} 0%, ${scale[200]} 34%, ${
    scale[300]
  } 54%, ${scale[400]} 69%, ${scale[500]} 80%, ${scale[600]} 87%, ${
    scale[700]
  } 92%, ${scale[800]} 96%, ${scale[900]} 100%)`;

const cardCssVariables = Object.fromEntries(
  Object.entries(cardStudioPalette).flatMap(([family, scale]) =>
    Object.entries(scale).map(([shade, value]) => [
      `--${family.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}-${shade.toLowerCase()}`,
      value,
    ]),
  ),
);

export const colorPalettes = {
  campus: {
    wine: "#173a37",
    red: "#c1121f",
    cream: "#f7f4ee",
    navy: "#173a37",
    sky: "#d9b76e",
  },
  light: {
    paper: "#f7f4ee",
    surface: "#fffdf6",
    surface2: "#f0e9da",
    surface3: "#e8e0d0",
    ink: "#173a37",
    muted: "#68756e",
    line: "rgba(34, 49, 42, 0.16)",
    accent: "#d9b76e",
    accentHover: "#ffd664",
    pine: "#315c57",
    pineHover: "#3a8a65",
    clay: "#8a6a1f",
    clayHover: "#d9b76e",
  },
  supplied: {
    floralWhite: "#f7f4ee",
    dustGrey: "#f0e9da",
    charcoalBrown: "#315c57",
    carbonBlack: "#173a37",
    spicyPaprika: "#d9b76e",
  },
  gradients: {
    top: "linear-gradient(0deg, #f7f4ee, #f0e9da, #315c57, #173a37, #d9b76e)",
    right: "linear-gradient(90deg, #f7f4ee, #f0e9da, #315c57, #173a37, #d9b76e)",
    bottom: "linear-gradient(180deg, #f7f4ee, #f0e9da, #315c57, #173a37, #d9b76e)",
    left: "linear-gradient(270deg, #f7f4ee, #f0e9da, #315c57, #173a37, #d9b76e)",
    radial: "radial-gradient(#f7f4ee, #f0e9da, #315c57, #173a37, #d9b76e)",
  },
  cardStudio: cardStudioPalette,
  cardThemes: {
    punchRed: {
      background: scaleGradient(cardStudioPalette.punchRed),
      text: cardStudioPalette.honeydew[900],
      muted: cardStudioPalette.punchRed[800],
      accent: cardStudioPalette.punchRed[600],
      shadow: cardStudioPalette.punchRed[100],
    },
    honeydew: {
      background: scaleGradient(cardStudioPalette.honeydew),
      text: cardStudioPalette.honeydew[900],
      muted: cardStudioPalette.honeydew[700],
      accent: cardStudioPalette.honeydew[300],
      shadow: cardStudioPalette.honeydew[100],
    },
    frostedBlue: {
      background: scaleGradient(cardStudioPalette.frostedBlue),
      text: cardStudioPalette.frostedBlue[900],
      muted: cardStudioPalette.frostedBlue[700],
      accent: cardStudioPalette.frostedBlue[400],
      shadow: cardStudioPalette.frostedBlue[100],
    },
    cerulean: {
      background: scaleGradient(cardStudioPalette.cerulean),
      text: cardStudioPalette.honeydew[900],
      muted: cardStudioPalette.cerulean[800],
      accent: cardStudioPalette.cerulean[600],
      shadow: cardStudioPalette.cerulean[100],
    },
    oxfordNavy: {
      background: scaleGradient(cardStudioPalette.oxfordNavy),
      text: cardStudioPalette.honeydew[900],
      muted: cardStudioPalette.oxfordNavy[800],
      accent: cardStudioPalette.oxfordNavy[600],
      shadow: cardStudioPalette.oxfordNavy[100],
    },
  },
  bigCardThemes: [
    {
      background: "#0d1321",
      text: "#f7f4ee",
      muted: "rgba(240, 235, 216, 0.72)",
      accent: "#68756e",
      shadow: "#0d1321",
    },
    {
      background: "#173a37",
      text: "#f7f4ee",
      muted: "rgba(240, 235, 216, 0.72)",
      accent: "#f7f4ee",
      shadow: "#0d1321",
    },
    {
      background: "#457b9d",
      text: "#f7f4ee",
      muted: "rgba(240, 235, 216, 0.76)",
      accent: "#f7f4ee",
      shadow: "#173a37",
    },
    {
      background: "#68756e",
      text: "#0d1321",
      muted: "#173a37",
      accent: "#0d1321",
      shadow: "#0d1321",
    },
  ],
  storyCardThemes: [
    {
      background: "#f7f4ee",
      text: "#173a37",
      muted: "#68756e",
      accent: "#315c57",
      rule: "rgba(23,58,55, 0.34)",
      buttonText: "#f7f4ee",
    },
    {
      background: "#f0e9da",
      text: "#173a37",
      muted: "#68756e",
      accent: "#315c57",
      rule: "rgba(23,58,55, 0.32)",
      buttonText: "#f7f4ee",
    },
    {
      background: "#315c57",
      text: "#f7f4ee",
      muted: "#f0e9da",
      accent: "#f7f4ee",
      rule: "rgba(247,244,238, 0.42)",
      buttonText: "#173a37",
    },
    {
      background: "#173a37",
      text: "#f7f4ee",
      muted: "#f0e9da",
      accent: "#f0e9da",
      rule: "rgba(247,244,238, 0.38)",
      buttonText: "#173a37",
    },
  ],
  kinetic: {
    primary: "#d9b76e",
    dark: "#0d1321",
    neutral100: "#f5f5f5",
    neutral200: "#e5e5e5",
    neutral300: "#d4d4d4",
    neutral800: "#262626",
  },
  cards: {
    surface: "#173a37",
    surfaceShadow: "#315c57",
    sage: "#315c57",
    sageShadow: "#173a37",
    clay: "#173a37",
    clayShadow: "#d9b76e",
    sand: "#315c57",
    sandShadow: "#173a37",
    text: "#f7f4ee",
    muted: "#f0e9da",
    accent: "#d9b76e",
    border: "rgba(255, 252, 242, 0.16)",
  },
};

export const colorPalette = {
  ...cardCssVariables,
  "--wine": colorPalettes.campus.wine,
  "--red": colorPalettes.campus.red,
  "--cream": colorPalettes.campus.cream,
  "--navy": colorPalettes.campus.navy,
  "--sky": colorPalettes.campus.sky,
  "--flow-paper": colorPalettes.light.paper,
  "--flow-surface": colorPalettes.light.surface,
  "--flow-surface-2": colorPalettes.light.surface2,
  "--flow-surface-3": colorPalettes.light.surface3,
  "--flow-ink": colorPalettes.light.ink,
  "--flow-muted": colorPalettes.light.muted,
  "--flow-line": colorPalettes.light.line,
  "--flow-accent": colorPalettes.light.accent,
  "--flow-pine": colorPalettes.light.pine,
  "--flow-clay": colorPalettes.light.clay,
  "--sgn-bg": colorPalettes.light.paper,
  "--sgn-surface": colorPalettes.light.surface,
  "--sgn-surface-2": colorPalettes.light.surface2,
  "--sgn-ink": colorPalettes.light.ink,
  "--sgn-muted": colorPalettes.light.muted,
  "--sgn-line": colorPalettes.light.line,
  "--sgn-accent": colorPalettes.light.accent,
  "--sgn-pine": colorPalettes.light.pine,
  "--sgn-clay": colorPalettes.light.clay,
  "--floral-white": colorPalettes.supplied.floralWhite,
  "--dust-grey": colorPalettes.supplied.dustGrey,
  "--charcoal-brown": colorPalettes.supplied.charcoalBrown,
  "--carbon-black": colorPalettes.supplied.carbonBlack,
  "--spicy-paprika": colorPalettes.supplied.spicyPaprika,
  "--dad7cd": "#f7f4ee",
  "--a3b18a": "#f0e9da",
  "--588157": "#315c57",
  "--3a5a40": "#68756e",
  "--344e41": "#173a37",
  "--gradient-top": colorPalettes.gradients.top,
  "--gradient-right": colorPalettes.gradients.right,
  "--gradient-bottom": colorPalettes.gradients.bottom,
  "--gradient-left": colorPalettes.gradients.left,
  "--gradient-radial": colorPalettes.gradients.radial,
};

export const heroActions = [
  { label: "Join CampusFlow", route: "/signup", variant: "accent" },
  { label: "Sign in", route: "/login", variant: "ghost" },
];

export { default as Button } from "./components/ui/button";
export { default as Footer } from "./components/ui/footer-section";
export { default as GlyphPortal } from "./components/ui/glyph-portal";
export { default as GlyphPortalPreloader } from "./components/ui/glyph-portal-preloader";
export { default as HorizonHero } from "./components/ui/horizon-hero-section";
export { default as SterlingGateNavigation } from "./components/ui/sterling-gate-kinetic-navigation";
export {
  default as StackingCards,
  StackingCardItem,
} from "./components/ui/stacking-cards";
export { default as FlowArt, FlowSection } from "./components/ui/story-scroll";
