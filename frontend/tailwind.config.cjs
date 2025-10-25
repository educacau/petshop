/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"InterVariable"', '"Inter"', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
          soft: 'var(--color-primary-soft)'
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
          elevated: 'var(--color-surface-elevated)'
        },
        content: {
          DEFAULT: 'var(--color-content)',
          muted: 'var(--color-content-muted)',
          strong: 'var(--color-content-strong)'
        },
        border: {
          DEFAULT: 'var(--color-border)',
          muted: 'var(--color-border-muted)'
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)'
        },
        success: {
          DEFAULT: 'var(--color-success)',
          soft: 'var(--color-success-soft)'
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          soft: 'var(--color-warning-soft)'
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          soft: 'var(--color-danger-soft)'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -15px rgba(15, 23, 42, 0.25)',
        focus: '0 0 0 3px var(--color-primary-soft)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      transitionTimingFunction: {
        'soft-spring': 'cubic-bezier(0.33, 1, 0.68, 1)'
      },
      keyframes: {
        'fade-in-up': {
          '0%': {opacity: 0, transform: 'translateY(16px)'},
          '100%': {opacity: 1, transform: 'translateY(0)'}
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.45s var(--ease-soft) both'
      }
    }
  },
  plugins: []
};
