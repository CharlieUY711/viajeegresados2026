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
        navy: {
          50:  "#eef0f7",
          100: "#d5daf0",
          200: "#aab4e0",
          300: "#7f8fd1",
          400: "#5469c1",
          500: "#2944b2",
          600: "#1e3490",
          700: "#16276e",
          800: "#0e1a4c",
          900: "#060d2a",
          950: "#030614",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        coral: {
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
        cream: {
          50: "#fdfcf9",
          100: "#faf8f2",
          200: "#f5f0e4",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15,22,41,0.06), 0 4px 16px -2px rgba(15,22,41,0.08)",
        "card-hover": "0 4px 8px 0 rgba(15,22,41,0.08), 0 12px 32px -4px rgba(15,22,41,0.12)",
        glow: "0 0 20px rgba(245,158,11,0.25)",
      },
      backgroundImage: {
        "sidebar-gradient": "linear-gradient(160deg, #0F1629 0%, #141d3d 50%, #0f1a3a 100%)",
        "gold-gradient": "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)",
        "card-texture": "radial-gradient(ellipse at top right, rgba(245,158,11,0.04) 0%, transparent 60%)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-in": "slideIn 0.35s ease forwards",
        "scale-in": "scaleIn 0.3s ease forwards",
        shimmer: "shimmer 2s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
