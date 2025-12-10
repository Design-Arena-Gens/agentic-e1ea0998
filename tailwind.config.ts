import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#e50914",
          dark: "#b20710",
          light: "#f40612"
        },
        surface: "#141414",
        surfaceAlt: "#181818"
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
