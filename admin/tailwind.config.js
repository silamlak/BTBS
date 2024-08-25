/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        "custom-orange": "#ec711d",
        "custom-blue": "#3070b5",
      },
    },
  },
  plugins: [],
};

