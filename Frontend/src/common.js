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
    wine: "#780000",
    red: "#c1121f",
    cream: "#fdf0d5",
    navy: "#003049",
    sky: "#669bbc",
  },
  light: {
    paper: "#f6f0e4",
    surface: "#fffdf6",
    surface2: "#f0e9da",
    surface3: "#e8e0d0",
    ink: "#22312a",
    muted: "#6d6a5c",
    line: "rgba(34, 49, 42, 0.16)",
    accent: "#f2c14e",
    accentHover: "#ffd664",
    pine: "#2c6b4d",
    pineHover: "#3a8a65",
    clay: "#d4693f",
    clayHover: "#e87a50",
  },
  supplied: {
    floralWhite: "#fffcf2",
    dustGrey: "#ccc5b9",
    charcoalBrown: "#403d39",
    carbonBlack: "#252422",
    spicyPaprika: "#eb5e28",
  },
  gradients: {
    top: "linear-gradient(0deg, #fffcf2, #ccc5b9, #403d39, #252422, #eb5e28)",
    right: "linear-gradient(90deg, #fffcf2, #ccc5b9, #403d39, #252422, #eb5e28)",
    bottom: "linear-gradient(180deg, #fffcf2, #ccc5b9, #403d39, #252422, #eb5e28)",
    left: "linear-gradient(270deg, #fffcf2, #ccc5b9, #403d39, #252422, #eb5e28)",
    radial: "radial-gradient(#fffcf2, #ccc5b9, #403d39, #252422, #eb5e28)",
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
      text: "#f0ebd8",
      muted: "rgba(240, 235, 216, 0.72)",
      accent: "#748cab",
      shadow: "#0d1321",
    },
    {
      background: "#1d2d44",
      text: "#f0ebd8",
      muted: "rgba(240, 235, 216, 0.72)",
      accent: "#f0ebd8",
      shadow: "#0d1321",
    },
    {
      background: "#3e5c76",
      text: "#f0ebd8",
      muted: "rgba(240, 235, 216, 0.76)",
      accent: "#f0ebd8",
      shadow: "#1d2d44",
    },
    {
      background: "#748cab",
      text: "#0d1321",
      muted: "#1d2d44",
      accent: "#0d1321",
      shadow: "#0d1321",
    },
  ],
  storyCardThemes: [
    {
      background: "#dad7cd",
      text: "#344e41",
      muted: "#3a5a40",
      accent: "#588157",
      rule: "rgba(52, 78, 65, 0.34)",
      buttonText: "#dad7cd",
    },
    {
      background: "#a3b18a",
      text: "#344e41",
      muted: "#3a5a40",
      accent: "#588157",
      rule: "rgba(52, 78, 65, 0.32)",
      buttonText: "#dad7cd",
    },
    {
      background: "#588157",
      text: "#dad7cd",
      muted: "#a3b18a",
      accent: "#dad7cd",
      rule: "rgba(218, 215, 205, 0.42)",
      buttonText: "#344e41",
    },
    {
      background: "#344e41",
      text: "#dad7cd",
      muted: "#a3b18a",
      accent: "#a3b18a",
      rule: "rgba(218, 215, 205, 0.38)",
      buttonText: "#344e41",
    },
  ],
  kinetic: {
    primary: "#6366f1",
    dark: "#131313",
    neutral100: "#f5f5f5",
    neutral200: "#e5e5e5",
    neutral300: "#d4d4d4",
    neutral800: "#262626",
  },
  cards: {
    surface: "#252422",
    surfaceShadow: "#403d39",
    sage: "#403d39",
    sageShadow: "#252422",
    clay: "#252422",
    clayShadow: "#eb5e28",
    sand: "#403d39",
    sandShadow: "#252422",
    text: "#fffcf2",
    muted: "#ccc5b9",
    accent: "#eb5e28",
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
  "--dad7cd": "#dad7cd",
  "--a3b18a": "#a3b18a",
  "--588157": "#588157",
  "--3a5a40": "#3a5a40",
  "--344e41": "#344e41",
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
