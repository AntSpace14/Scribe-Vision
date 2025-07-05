// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        aurora: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        lightbulbPulse: {
          "0%, 100%": {
            filter: "drop-shadow(0 0 8px #facc15) brightness(0.9)",
          },
          "50%": {
            filter: "drop-shadow(0 0 24px #facc15) brightness(1.9)",
          },
        },
      },
      animation: {
        aurora: "aurora 6s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out both",
        "lightbulb-pulse": "lightbulbPulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
