// lib/design-tokens.ts
// ═══════════════════════════════════════════════════════════════
// Cape Town Marathon 2027 — Design Tokens
// Single source of truth for colors, typography, spacing, animations
// ═══════════════════════════════════════════════════════════════

export const tokens = {
  // ─── Colors ─────────────────────────────────────────────────
  colors: {
    // Brand
    teal: {
      50:  '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },
    amber: {
      50:  '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    // Surfaces
    surface: {
      bg:        '#0a0a0a',
      elevated:  '#171717',
      card:      '#262626',
      hover:     '#404040',
    },
    // Text
    text: {
      primary:   '#ffffff',
      secondary: '#a3a3a3',
      muted:     '#737373',
      disabled:  '#525252',
    },
    // Semantic
    semantic: {
      success: '#14b8a6',
      warning: '#f59e0b',
      error:   '#ef4444',
      info:    '#3b82f6',
    },
  },

  // ─── Typography ───────────────────────────────────────────
  typography: {
    fontFamily: {
      sans:  'var(--font-inter), system-ui, -apple-system, sans-serif',
      mono:  'ui-monospace, SFMono-Regular, "SF Mono", monospace',
    },
    scale: {
      xs:   { size: '0.75rem',  lineHeight: '1rem' },
      sm:   { size: '0.875rem', lineHeight: '1.25rem' },
      base: { size: '1rem',     lineHeight: '1.5rem' },
      lg:   { size: '1.125rem', lineHeight: '1.75rem' },
      xl:   { size: '1.25rem',  lineHeight: '1.75rem' },
      '2xl':{ size: '1.5rem',   lineHeight: '2rem' },
      '3xl':{ size: '1.875rem', lineHeight: '2.25rem' },
      '4xl':{ size: '2.25rem',  lineHeight: '2.5rem' },
      '5xl':{ size: '3rem',     lineHeight: '1' },
      '6xl':{ size: '3.75rem',  lineHeight: '1' },
      '7xl':{ size: '4.5rem',   lineHeight: '1' },
    },
    weight: {
      normal:  '400',
      medium:  '500',
      semibold:'600',
      bold:    '700',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight:   '-0.025em',
      normal:  '0',
      wide:    '0.025em',
      wider:   '0.05em',
      widest:  '0.1em',
    },
  },

  // ─── Spacing ────────────────────────────────────────────────
  spacing: {
    '0':  '0',
    '1':  '0.25rem',
    '2':  '0.5rem',
    '3':  '0.75rem',
    '4':  '1rem',
    '5':  '1.25rem',
    '6':  '1.5rem',
    '8':  '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '40': '10rem',
    '48': '12rem',
    '64': '16rem',
  },

  // ─── Border Radius ──────────────────────────────────────────
  radius: {
    none: '0',
    sm:   '0.375rem',
    md:   '0.5rem',
    lg:   '0.75rem',
    xl:   '1rem',
    '2xl':'1.5rem',
    '3xl':'2rem',
    full: '9999px',
  },

  // ─── Shadows ────────────────────────────────────────────────
  shadows: {
    sm:   '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md:   '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg:   '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl:   '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: {
      teal:  '0 0 20px rgba(20, 184, 166, 0.3)',
      amber: '0 0 20px rgba(245, 158, 11, 0.3)',
      tealStrong: '0 0 40px rgba(20, 184, 166, 0.5)',
    },
    glass: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },

  // ─── Animation ──────────────────────────────────────────────
  animation: {
    duration: {
      fast:   '150ms',
      normal: '300ms',
      slow:   '500ms',
      slower: '800ms',
      slowest:'1000ms',
    },
    easing: {
      default:     'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn:      'cubic-bezier(0.4, 0, 1, 1)',
      easeOut:     'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut:   'cubic-bezier(0.76, 0, 0.24, 1)',
      spring:      'cubic-bezier(0.22, 1, 0.36, 1)',
      bounce:      'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    keyframes: {
      'fade-in-up': {
        from: { opacity: '0', transform: 'translateY(30px)' },
        to:   { opacity: '1', transform: 'translateY(0)' },
      },
      'gradient-shift': {
        '0%, 100%': { backgroundPosition: '0% center' },
        '50%':      { backgroundPosition: '100% center' },
      },
      'pulse-slow': {
        '0%, 100%': { transform: 'scale(1)', opacity: '0.2' },
        '50%':      { transform: 'scale(1.1)', opacity: '0.3' },
      },
      'pulse-slow-delayed': {
        '0%, 100%': { transform: 'scale(1)', opacity: '0.15' },
        '50%':      { transform: 'scale(1.15)', opacity: '0.25' },
      },
      'pulse-ring': {
        '0%':   { transform: 'scale(1)', opacity: '0.5' },
        '100%': { transform: 'scale(2)', opacity: '0' },
      },
      'marquee': {
        '0%':   { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(-50%)' },
      },
      'draw-route': {
        to: { strokeDashoffset: '0' },
      },
    },
  },

  // ─── Z-Index Scale ──────────────────────────────────────────
  zIndex: {
    base:     '0',
    dropdown: '10',
    sticky:   '20',
    fixed:    '30',
    modal:    '40',
    popover:  '50',
    tooltip:  '60',
    cursor:   '9999',
    preloader:'100',
  },

  // ─── Breakpoints ────────────────────────────────────────────
  breakpoints: {
    sm:  '640px',
    md:  '768px',
    lg:  '1024px',
    xl:  '1280px',
    '2xl':'1536px',
  },
} as const;

export type TokenColors = typeof tokens.colors;
export type TokenTypography = typeof tokens.typography;
export type TokenSpacing = typeof tokens.spacing;
export type TokenRadius = typeof tokens.radius;
export type TokenShadows = typeof tokens.shadows;
export type TokenAnimation = typeof tokens.animation;
export type TokenZIndex = typeof tokens.zIndex;
export type TokenBreakpoints = typeof tokens.breakpoints;

export function cssVar(name: string, fallback?: string): string {
  if (typeof window === 'undefined') return fallback || '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback || '';
}

export function setCssVar(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty(name, value);
}
