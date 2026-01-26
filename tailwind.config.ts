import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        critical: "#DC2626",
        high: "#EA580C",
        medium: "#FACC15",
        low: "#22C55E",
      },
    },
  },
  plugins: [],
};

export default config;
