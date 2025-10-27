
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { 
    extend: { 
      boxShadow: { 
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        glow: "0 0 50px rgba(59, 130, 246, 0.3)",
        "glow-cyan": "0 0 50px rgba(6, 182, 212, 0.3)",
        "glow-violet": "0 0 50px rgba(139, 92, 246, 0.3)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    } 
  },
  plugins: [],
} satisfies Config;
