import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // These reference the CSS custom properties in globals.css, so every
        // text-primary / bg-primary-light / etc. class responds live to the
        // data-theme="dark" attribute — no per-class dark: variants needed.
        primary: {
          DEFAULT: 'var(--color-primary)',
          deep: 'var(--color-primary-deep)',
          dark: 'var(--color-primary-dark)',
          active: 'var(--color-primary-active)',
          light: 'var(--color-primary-light)',
          xlight: 'var(--color-primary-xlight)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
          light: 'var(--color-accent-light)',
        },
        bg: {
          page: 'var(--color-bg-page)',
          card: 'var(--color-bg-card)',
          sunken: 'var(--color-bg-sunken)',
          input: 'var(--color-bg-input)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          disabled: 'var(--color-text-disabled)',
          white: '#FFFFFF',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          focus: 'var(--color-border-focus)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          light: 'var(--color-error-light)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
        },
        nav: {
          active: 'var(--color-nav-active)',
          inactive: 'var(--color-nav-inactive)',
          bg: 'var(--color-nav-bg)',
          border: 'var(--color-nav-border)',
        },
        cat: {
          'cleaning-bg': '#EEF2FF',
          'cleaning-icon': '#4F46E5',
          'repairs-bg': '#FFF7ED',
          'repairs-icon': '#D97706',
          'deliveries-bg': '#F0F9FF',
          'deliveries-icon': '#0284C7',
          'handyman-bg': '#FEFCE8',
          'handyman-icon': '#CA8A04',
          'petcare-bg': '#FFF1F2',
          'petcare-icon': '#E11D48',
          'cooking-bg': '#F0FDF4',
          'cooking-icon': '#16A34A',
          'other-bg': '#F1F5F9',
          'other-icon': '#64748B',
        },
        qa: {
          'bookings-bg': '#E7F0FD',
          'bookings-icon': '#1565D8',
          'jobs-bg': '#F0FDF4',
          'jobs-icon': '#16A34A',
          'earnings-bg': '#FFF3E0',
          'earnings-icon': '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
        display: ['Fraunces', 'Georgia', "'Times New Roman'", 'serif'],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.4', fontWeight: '400' }],
        sm: ['13px', { lineHeight: '1.4', fontWeight: '400' }],
        base: ['15px', { lineHeight: '1.5', fontWeight: '400' }],
        md: ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        lg: ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        xl: ['22px', { lineHeight: '1.3', fontWeight: '700' }],
        '2xl': ['26px', { lineHeight: '1.2', fontWeight: '700' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      borderRadius: {
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,22,18,0.07), 0 6px 18px rgba(26,22,18,0.05)',
        elevated: '0 12px 30px rgba(21,101,216,0.24)',
        nav: '0 -1px 0px rgba(26,22,18,0.08)',
      },
      height: {
        input: '52px',
        btn: '52px',
        nav: '64px',
      },
    },
  },
  plugins: [],
}
export default config
