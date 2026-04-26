// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Warm palette (user pages) ─────────────────────────────
      colors: {
        // Surface hierarchy
        'background':               '#fff8f4',
        'surface':                  '#fff8f4',
        'surface-bright':           '#fff8f4',
        'surface-dim':              '#e8d7ca',
        'surface-variant':          '#f0e0d2',
        'surface-container-lowest': '#ffffff',
        'surface-container-low':    '#fff1e7',
        'surface-container':        '#fcebdd',
        'surface-container-high':   '#f6e5d7',
        'surface-container-highest':'#f0e0d2',

        // Primary (warm amber)
        'primary':              '#895100',
        'on-primary':           '#ffffff',
        'primary-container':    '#ff9f1c',
        'on-primary-container': '#683c00',
        'primary-fixed':        '#ffdcbc',
        'primary-fixed-dim':    '#ffb86b',
        'on-primary-fixed':     '#2c1700',
        'on-primary-fixed-variant': '#683d00',
        'inverse-primary':      '#ffb86b',
        'surface-tint':         '#895100',

        // Secondary
        'secondary':            '#685c55',
        'on-secondary':         '#ffffff',
        'secondary-container':  '#eddcd3',
        'on-secondary-container':'#6c6059',
        'secondary-fixed':      '#f0dfd6',
        'secondary-fixed-dim':  '#d3c3ba',
        'on-secondary-fixed':   '#221a14',
        'on-secondary-fixed-variant': '#4f453e',

        // Tertiary (cool blue accent)
        'tertiary':             '#006686',
        'on-tertiary':          '#ffffff',
        'tertiary-container':   '#00c3fd',
        'on-tertiary-container':'#004d66',
        'tertiary-fixed':       '#c0e8ff',
        'tertiary-fixed-dim':   '#70d2ff',
        'on-tertiary-fixed':    '#001e2b',
        'on-tertiary-fixed-variant': '#004d66',

        // Text
        'on-background':        '#221a12',
        'on-surface':           '#221a12',
        'on-surface-variant':   '#544434',
        'outline':              '#877462',
        'outline-variant':      '#dac2ae',

        // Inverse
        'inverse-surface':      '#382f25',
        'inverse-on-surface':   '#ffeee0',

        // Error
        'error':                '#ba1a1a',
        'on-error':             '#ffffff',
        'error-container':      '#ffdad6',
        'on-error-container':   '#93000a',

        // ── Cool palette (admin pages) ─────────────────────────
        'admin-sidebar':        '#1e293b',
        'admin-sidebar-hover':  '#334155',
        'admin-primary':        '#1e40af',
        'admin-primary-hover':  '#1e3a8a',
        'admin-accent':         '#0ea5e9',
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
        'sans':      ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'body':      ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        'heading':   ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
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
        'amber':       '0 4px 20px rgba(139, 94, 0, 0.08)',
        'amber-hover': '0 12px 32px rgba(139, 94, 0, 0.12)',
        'input-focus': '0 0 0 3px rgba(137, 81, 0, 0.2)',
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
