const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./dist-electron/**/*.{vue,js,ts,jsx,tsx,html}",
  ],
  safelist: [
    {
      pattern:
        /bg-(brand|red|green|blue|bush|purple)-(100|200|700|600|400|800|900)/,
      variants: ["dark"],
    },
    {
      pattern:
        /text-(brand|red|green|blue|bush|purple)-(100|200|700|600|400|800|900)/,
      variants: ["dark"],
    },
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans Khmer", ...defaultTheme.fontFamily.sans],
        "khmer-s1": ["Khmer S1", ...defaultTheme.fontFamily.sans],
        "limon-r1": ["Kh Baphnom Limon R1", ...defaultTheme.fontFamily.sans],
        moulpali: ["Moulpali", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#002e77",
        darkPrimary: "#081b45",
        brand: {
          50: "#e8f8ff",
          100: "#d5f1ff",
          200: "#b4e3ff",
          300: "#87ceff",
          400: "#58a9ff",
          500: "#3285ff",
          600: "#105aff",
          700: "#064ffc",
          800: "#0946ca",
          900: "#12419d",
          950: "#081b45",
        },
        bush: {
          50: "#f2fbf3",
          100: "#e2f6e4",
          200: "#c6ecca",
          300: "#9adba2",
          400: "#66c272",
          500: "#41a64e",
          600: "#31883c",
          700: "#296c32",
          800: "#25562c",
          900: "#204726",
          950: "#113317",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
};
