import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const addVariablesForColors = ({ addBase, theme }: any) => {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        titleToTop: {
          '0%': { transform: 'translateY(0vh)' },
          '50%': { transform: 'translateY(-30vh)' },
          '100%': { transform: 'translateY(-31vh)' }
        },
        inputToBottom: {
          '0%': { transform: 'translateY(0vh)', opacity: '0' },
          '50%': { transform: 'translateY(28vh)', opacity: '0.5' },
          '100%': { transform: 'translateY(28vh)', opacity: '1' }
        },
        buttonVanish: {
          '0%': {
            opacity: '1',
            transform: 'scale(1) rotate(0deg)',
            filter: 'blur(0px)',
            boxShadow: '0 0 0 rgba(66, 153, 225, 0)'
          },
          '30%': {
            opacity: '0.9',
            transform: 'scale(1.05) rotate(-2deg)',
            filter: 'blur(0px)',
            boxShadow: '0 0 15px rgba(66, 153, 225, 0.5)'
          },
          '60%': {
            opacity: '0.5',
            transform: 'scale(0.98) rotate(1deg)',
            filter: 'blur(2px)',
            boxShadow: '0 0 10px rgba(66, 153, 225, 0.3)'
          },
          '100%': {
            opacity: '0',
            transform: 'scale(0.95) rotate(0deg)',
            filter: 'blur(4px)',
            boxShadow: '0 0 0 rgba(66, 153, 225, 0)'
          }
        },
        slideIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px) scale(0.98)',
            filter: 'blur(8px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0px)'
          }
        },
        slideLeft: {
          '0%': { 
            opacity: '1',
            transform: 'translateX(0) scale(1)',
            filter: 'blur(0px)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(-100px) scale(0.95)',
            filter: 'blur(4px)'
          }
        },
        slideInFromLeft: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(100px) scale(0.95)',
            filter: 'blur(4px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0) scale(1)',
            filter: 'blur(0px)'
          }
        },

      },
      
  
    animation: {
      titleToTopAnimation: 'titleToTop 3s ease-in-out forwards',
      inputToBottomAnimation: 'inputToBottom 1s ease-in-out forwards',
      buttonVanishAnimation: 'buttonVanish 0.5s ease-out forwards',
      slideIn: 'slideIn 2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      slideLeft: 'slideLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      slideInFromLeft: 'slideInFromLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
      

    },
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      chart: {
        "1": "hsl(var(--chart-1))",
        "2": "hsl(var(--chart-2))",
        "3": "hsl(var(--chart-3))",
        "4": "hsl(var(--chart-4))",
        "5": "hsl(var(--chart-5))",
      },
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
  },
},
  plugins: [addVariablesForColors, require("tailwindcss-animate")],
};

export default config;
