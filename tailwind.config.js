/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E1E1E',
        secondary: '#FFFFFF',
        third: "#2F363B"
      },
<<<<<<< HEAD
      width: {
        138: "34.5rem",
        161: "40.25rem",
        192: "48rem",
      },
      height: {
        138: "34.5rem",
        161: "40.25rem",
        192: "48rem",
=======
      minWidth: {
        56: '14rem',
>>>>>>> 88b8b6f3f2e00b25ddc81b0dd38e6025af8f1d96
      },
    },
  },
  plugins: [],
};
