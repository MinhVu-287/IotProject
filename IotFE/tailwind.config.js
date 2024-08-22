/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          "primary-bg": "#3c486a",
          "secondary-bg": "#d4cfcf",
          "primary-text": "#2a344c",
          "secondary-text": "#eef0f6",
          "primary-btn": "#179aaf",
          "secondary-btn": "#59929b",
        },
      },
    },
    variants: {},
    plugins: [],
  };
  