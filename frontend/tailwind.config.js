// const { nextui } = require("@nextui-org/react");

// /** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths based on your project structure
    "./public/index.html",
    // "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        urdu: ['"Noto Nastaliq Urdu"', 'serif'], // Add the Urdu font
      },
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-in',
      'pulse': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0, transform: 'translateY(10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      }
    }
  },
  darkMode: "class",
  plugins: []
};
