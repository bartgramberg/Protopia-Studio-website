/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        green:   { DEFAULT: '#48735B', dark: '#3a5e49' },
        creme:   '#F2EFE9',
        magenta: '#D90D7D',
        blue:    '#347EBF',
        dark:    '#1A1A1A',
        mid:     '#4A4A4A',
        light:   '#7A7A7A',
        border:  '#DEDAD4',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      maxWidth: {
        content: '1100px',
      },
      borderRadius: {
        pill: '999px',
      },
    },
  },
  plugins: [],
}
