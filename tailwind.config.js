/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "components/**/*.{js,jsx,ts,tsx}",
    "pages/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // primary: {
        //   DEFAULT: "#FFD700",
        //   50: "#F7FFA1",
        //   100: "#F9FF8F",
        //   200: "#FFFF6B",
        //   300: "#FFF647",
        //   400: "#FFE824",
        //   500: "#FFD700",
        //   600: "#E6B500",
        //   700: "#CC9600",
        //   800: "#B37A00",
        //   900: "#996000",
        // },
        primary: {
          DEFAULT: "#8E19D5",
          50: "#DBB0F6",
          100: "#D39EF4",
          200: "#C379EF",
          300: "#B255EB",
          400: "#A230E7",
          500: "#8E19D5",
          600: "#6D13A3",
          700: "#4B0D71",
          800: "#2A073E",
          900: "#08010C",
        },
      },
      fontFamily: {
        sans: ["Lexend", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("tailwind-scrollbar-hide"),
  ],
};
