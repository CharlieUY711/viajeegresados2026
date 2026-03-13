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
        // Marca LifeSchool — Azul principal
        navy: {
          50:  "#eef2f8",
          100: "#d0dced",
          200: "#a1b9db",
          300: "#7296c9",
          400: "#4373b7",
          500: "#1B3A6B", // Azul LifeSchool
          600: "#163060",
          700: "#112550",
          800: "#0b1a3a",
          900: "#060e22",
          950: "#030814",
        },
        // Rojo LifeSchool
        red: {
          50:  "#fdf2f4",
          100: "#fce0e5",
          200: "#f8b4be",
          300: "#f38898",
          400: "#e85c72",
          500: "#C41E3A", // Rojo LifeSchool
          600: "#a8182f",
          700: "#8c1226",
          800: "#700d1d",
          900: "#540814",
          950: "#380510",
        },
        // Blancos y grises neutros
        cream: {
          50:  "#ffffff",
          100: "#f8f9fb",
          200: "#eef1f6",
        },
        // Mantener amber solo para estados/badges
        amber: {
          50:  "#fffbeb",
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
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans:    ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:       "0 1px 3px 0 rgba(11,26,58,0.06), 0 4px 16px -2px rgba(11,26,58,0.08)",
        "card-hover":"0 4px 8px 0 rgba(11,26,58,0.08), 0 12px 32px -4px rgba(11,26,58,0.14)",
        glow:       "0 0 20px rgba(196,30,58,0.30)",
        "glow-blue":"0 0 20px rgba(27,58,107,0.30)",
      },
      backgroundImage: {
        // Sidebar oscuro azul marino
        "sidebar-gradient": "linear-gradient(160deg, #0b1a3a 0%, #112550 50%, #0b1a3a 100%)",
        // Acento rojo
        "red-gradient":     "linear-gradient(135deg, #C41E3A 0%, #e85c72 50%, #a8182f 100%)",
        // Acento azul
        "blue-gradient":    "linear-gradient(135deg, #1B3A6B 0%, #4373b7 50%, #163060 100%)",
        "card-texture":     "radial-gradient(ellipse at top right, rgba(27,58,107,0.04) 0%, transparent 60%)",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-in":   "slideIn 0.35s ease forwards",
        "scale-in":   "scaleIn 0.3s ease forwards",
        shimmer:      "shimmer 2s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
