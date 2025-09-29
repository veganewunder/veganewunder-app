import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#224f24",
        background: "#f7f3eb",
        accent: "#faebcc",
        highlight: "#ff9800",
      },
    },
  },
  plugins: [],
};

export default config;
