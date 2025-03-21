/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            maxWidth: '100%',
            p: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            a: {
              color: '#2563eb', // Tailwind blue-600
              textDecoration: 'underline',
              '&:hover': {
                color: '#1d4ed8', // Tailwind blue-700
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...other plugins
  ],
}