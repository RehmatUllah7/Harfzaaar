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
  },
  darkMode: "class",
  plugins: []
};
