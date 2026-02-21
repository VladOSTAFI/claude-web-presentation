import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#131A21",
        "accent-purple": "#7F56D9",
        "accent-blue": "#4D65FF",
        "text-primary": "#FFFFFF",
        "text-secondary": "#999999",
        "text-muted": "#666666",
        "border-subtle": "rgba(255,255,255,0.15)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
