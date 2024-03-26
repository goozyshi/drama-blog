/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    ".vitepress/theme/components/*.vue",
    ".vitepress/theme/pages/*.vue",
    "./posts/**/*.md",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

