/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
          overlay: 'rgb(var(--color-surface-overlay) / <alpha-value>)',
          subtle: 'rgb(var(--color-surface-subtle) / <alpha-value>)',
          border: 'rgb(var(--color-surface-border) / var(--alpha-surface-border))',
        },
        content: {
          DEFAULT: 'rgb(var(--color-content) / <alpha-value>)',
          secondary: 'rgb(var(--color-content-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-content-muted) / var(--alpha-content-muted))',
          dimmed: 'rgb(var(--color-content-dimmed) / var(--alpha-content-dimmed))',
          white: 'rgb(var(--color-content-white) / <alpha-value>)',
          meta: 'rgb(var(--color-content-meta) / <alpha-value>)',
          inverse: 'rgb(var(--color-content-inverse) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / var(--alpha-accent))',
          hover: 'rgb(var(--color-accent) / var(--alpha-accent-hover))',
          muted: 'rgb(var(--color-accent) / var(--alpha-accent-muted))',
        },
        glow: {
          blue: 'rgb(var(--color-glow-blue) / var(--alpha-glow-blue))',
          steel: 'rgb(var(--color-glow-steel) / var(--alpha-glow-steel))',
          light: 'rgb(var(--color-glow-light) / var(--alpha-glow-light))',
        },
        'card-highlight': 'rgb(var(--color-card-highlight) / var(--alpha-card-highlight))',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        tint: 'rgb(var(--color-tint) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        // Bridge — display alias to Inter (was Plus Jakarta Sans, prevents 32-file breakage)
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '500' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '500' }],
        'display-md': ['2.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '500' }],
        'heading-xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '500' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '500' }],
        'heading-md': ['1.25rem', { lineHeight: '1.3', fontWeight: '500' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.35', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label-lg': ['0.875rem', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.08em', fontWeight: '600' }],
        'quote': ['2rem', { lineHeight: '1.4', letterSpacing: '-0.03em', fontWeight: '400' }],
      },
      spacing: {
        section: '6.25rem',
        'section-sm': '4.5rem',
      },
      maxWidth: {
        container: '1260px',
        content: '900px',
        narrow: '680px',
      },
      borderRadius: {
        card: '16px',
        'card-lg': '20px',
        'card-sm': '12px',
        button: '100px',
        badge: '100px',
        image: '20px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        glass: 'var(--shadow-card)',
        'glass-hover': 'var(--shadow-card-hover)',
        glow: 'var(--shadow-glow)',
        'glow-cta': 'var(--shadow-glow-cta)',
        'btn-primary': 'var(--shadow-btn-primary)',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};
