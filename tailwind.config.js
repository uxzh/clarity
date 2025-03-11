/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");
const { addDynamicIconSelectors } = require("@iconify/tailwind");

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "scrolling-banner": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-50% - var(--gap)/2))" },
        },
        "scrolling-banner-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-50% - var(--gap)/2))" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scrollVertical: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
      animation: {
        "scrolling-banner": "scrolling-banner var(--duration) linear infinite",
        "scrolling-banner-vertical":
          "scrolling-banner-vertical var(--duration) linear infinite",
        "scrolling-banner": "scroll var(--duration) linear infinite",
        "scrolling-banner-vertical":
          "scrollVertical var(--duration) linear infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), addDynamicIconSelectors()],
};
