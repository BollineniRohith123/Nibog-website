/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pale-yellow': '#F0E68C',
        'teal': '#008080',
        'gray': '#8B8B83',
        'coral-red': '#E97451',
        'light-blue': '#ADD8E6',
        'green': '#228B22',
        'light-cyan': '#5F9EA0',
        'medium-turquoise': '#40E0D0',
        'dark-green': '#006400',
      },
      fontFamily: {
        'primary': ['Montserrat', 'sans-serif'],
        'secondary': ['Lato', 'sans-serif'],
      },
      fontSize: {
        'h1': '3rem',
        'h2': '2.25rem',
        'h3': '1.875rem',
        'h4': '1.5rem',
        'body': '1rem',
        'caption': '0.875rem',
      },
      borderRadius: {
        'apple-sm': '8px',
        'apple-md': '12px',
        'apple-lg': '16px',
        'apple-xl': '24px',
      },
      boxShadow: {
        'apple-light': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'apple-medium': '0 4px 8px rgba(0, 0, 0, 0.12)',
        'apple-heavy': '0 8px 16px rgba(0, 0, 0, 0.16)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #008080, #40E0D0)',
        'gradient-hover': 'linear-gradient(to right, #006400, #5F9EA0)',
      },
      spacing: {
        'apple-xs': '8px',
        'apple-sm': '16px',
        'apple-md': '24px',
        'apple-lg': '32px',
        'apple-xl': '48px',
      },
      transitionProperty: {
        'apple': 'all 0.3s ease-in-out',
      },
      gridTemplateColumns: {
        '12': 'repeat(12, 1fr)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
