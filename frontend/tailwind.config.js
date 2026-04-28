// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Warm Orange palette (user pages) — Shopee/Etsy energy ──
      colors: {
        // Surfaces: nearly white with the faintest warm tint — not creamy/beige
        'background':               '#fafaf8',
        'surface':                  '#ffffff',
        'surface-bright':           '#ffffff',
        'surface-dim':              '#ede8e2',
        'surface-variant':          '#f3ede7',
        'surface-container-lowest': '#ffffff',
        'surface-container-low':    '#faf6f2',
        'surface-container':        '#f4ede7',
        'surface-container-high':   '#ece5de',
        'surface-container-highest':'#e5ddd6',

        // Primary — vivid orange, not dark/brown; high contrast on white
        'primary':              '#e8590c',
        'on-primary':           '#ffffff',
        'primary-container':    '#ffead5',
        'on-primary-container': '#6c2500',
        'primary-fixed':        '#ffcca8',
        'primary-fixed-dim':    '#ff9a5c',
        'on-primary-fixed':     '#360f00',
        'on-primary-fixed-variant': '#9d3800',
        'inverse-primary':      '#ff9a5c',
        'surface-tint':         '#c44800',

        // Secondary — warm neutral for subtler elements
        'secondary':            '#7a6358',
        'on-secondary':         '#ffffff',
        'secondary-container':  '#ffede5',
        'on-secondary-container':'#5a3d33',
        'secondary-fixed':      '#f5dfd8',
        'secondary-fixed-dim':  '#d4bdb6',
        'on-secondary-fixed':   '#2e1710',
        'on-secondary-fixed-variant': '#5f4039',

        // Tertiary — teal accent for badges/highlights (cool contrast)
        'tertiary':             '#00757a',
        'on-tertiary':          '#ffffff',
        'tertiary-container':   '#c8f4f6',
        'on-tertiary-container':'#00494d',
        'tertiary-fixed':       '#aaeef2',
        'tertiary-fixed-dim':   '#6dd6db',
        'on-tertiary-fixed':    '#002022',
        'on-tertiary-fixed-variant': '#00494d',

        // Text — dark near-black with very faint warmth; avoids brown reads
        'on-background':        '#1a1110',
        'on-surface':           '#1a1110',
        'on-surface-variant':   '#6b5850',
        'outline':              '#9a8680',
        'outline-variant':      '#e8ddd9',

        // Inverse
        'inverse-surface':      '#352523',
        'inverse-on-surface':   '#fff0eb',

        // Error
        'error':                '#c41818',
        'on-error':             '#ffffff',
        'error-container':      '#ffe5e5',
        'on-error-container':   '#8a0000',

        // ── Admin palette — cool deep navy/blue (unchanged) ──────
        'admin-sidebar':        '#0f172a',
        'admin-sidebar-hover':  '#1e293b',
        'admin-primary':        '#1a56db',
        'admin-primary-hover':  '#1347c0',
        'admin-accent':         '#3b82f6',
        'admin-bg':             '#f1f5f9',
        'admin-border':         '#e2e8f0',
        'admin-text':           '#0f172a',
        'admin-muted':          '#64748b',
        'admin-table-header':   '#f8fafc',
        'admin-badge-blue-bg':  '#dbeafe',
        'admin-badge-blue-text':'#1e40af',
      },

      borderRadius: {
        DEFAULT: '0.25rem',
        lg:      '0.5rem',
        xl:      '0.75rem',
        '2xl':   '1.25rem',
        full:    '9999px',
      },

      spacing: {
        'xs':            '4px',
        'sm':            '8px',
        'md':            '16px',
        'lg':            '24px',
        'xl':            '40px',
        '2xl':           '64px',
        'gutter':        '24px',
        'container-max': '1280px',
      },

      fontFamily: {
        'sans':    ['"Rubik"', 'system-ui', 'sans-serif'],
        'body':    ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        'heading': ['"Rubik"', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'nav-link':   ['16px', { lineHeight: 'auto',  fontWeight: '500' }],
        'button':     ['16px', { lineHeight: '1',     letterSpacing: '0.01em', fontWeight: '600' }],
        'h1':         ['48px', { lineHeight: '1.2',   letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2':         ['32px', { lineHeight: '1.3',   letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3':         ['24px', { lineHeight: '1.4',   fontWeight: '600' }],
        'h-login':    ['28px', { lineHeight: '1.2',   fontWeight: '700' }],
        'label-caps': ['12px', { lineHeight: '1',     letterSpacing: '0.05em', fontWeight: '700' }],
        'body-lg':    ['18px', { lineHeight: '1.6',   fontWeight: '400' }],
        'body-md':    ['16px', { lineHeight: '1.5',   fontWeight: '400' }],
        'body-sm':    ['14px', { lineHeight: '1.5',   fontWeight: '400' }],
      },

      boxShadow: {
        'amber':       '0 4px 20px rgba(232, 89, 12, 0.08)',
        'amber-hover': '0 12px 32px rgba(232, 89, 12, 0.14)',
        'input-focus': '0 0 0 3px rgba(232, 89, 12, 0.20)',
        'admin':       '0 1px 4px rgba(0, 0, 0, 0.07)',
      },

      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
