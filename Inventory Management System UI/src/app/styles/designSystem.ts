/**
 * Inventory Management System - Design System
 * 
 * Modern SaaS Dashboard with Role-Based Dashboards
 */

// ============================================
// COLOR PALETTE
// ============================================

export const colors = {
  // Primary Colors
  primary: '#3B82F6', // Blue
  primaryDark: '#1E40AF',
  primaryLight: '#DBEAFE',

  // Secondary Colors
  secondary: '#10B981', // Green
  secondaryDark: '#047857',
  secondaryLight: '#D1FAE5',

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Neutral Colors
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',

  // Background & Surface
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceHover: '#F1F5F9',
  border: '#E2E8F0',

  // Text Colors
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
};

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  // Font Families
  fontFamily: "'Inter', 'system-ui', '-apple-system', 'sans-serif'",
  fontFamilyMono: "'Fira Code', 'monospace'",

  // Font Sizes
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },

  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// ============================================
// SPACING SYSTEM
// ============================================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
};

// ============================================
// BORDER RADIUS
// ============================================

export const radius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================
// Z-INDEX
// ============================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  backdrop: 1300,
  offcanvas: 1400,
  modal: 1500,
  popover: 1600,
  tooltip: 1700,
};

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  fast: '150ms ease-in-out',
  base: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};

// ============================================
// ROLE-BASED COLORS
// ============================================

export const roleColors = {
  admin: {
    background: '#DBEAFE',
    text: '#1E40AF',
    badge: '#3B82F6',
  },
  staff: {
    background: '#DCFCE7',
    text: '#166534',
    badge: '#16A34A',
  },
  manager: {
    background: '#F3E8FF',
    text: '#581C87',
    badge: '#9333EA',
  },
};

export default {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  breakpoints,
  zIndex,
  transitions,
  roleColors,
};
