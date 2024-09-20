/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "c-primary": "#000000",
        "c-secondary": "#213555",
        "c-tertiary": "#068FFF",
        "c-quaternary": "#EEEEEE",
        "c-quinary": "#F5F7F8",
        "c-blue": "#08045c",
      },
      boxShadow: {
        "c-shadow": "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
      },
    },
  },
  plugins: [],
};
