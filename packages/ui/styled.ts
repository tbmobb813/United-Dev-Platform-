import { Theme } from './theme';
import type { CSSProperties } from 'react';

/**
 * Styled Component Helpers
 *
 * Utility functions for creating themed styles without a CSS-in-JS library
 * These helpers make it easy to access theme values in inline styles
 */

/**
 * Create a style object with theme-aware values
 */
export function createStyles<T extends Record<string, CSSProperties>>(
  stylesFn: (theme: Theme) => T
): (theme: Theme) => T {
  return stylesFn;
}

/**
 * Merge multiple style objects
 */
export function mergeStyles(
  ...styles: (CSSProperties | undefined)[]
): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

/**
 * Create a CSS variable reference
 */
export function cssVar(name: string): string {
  return `var(--${name})`;
}

/**
 * Common style patterns
 */
export const stylePatterns = {
  /**
   * Flexbox centering
   */
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Flexbox between (space-between with center alignment)
   */
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /**
   * Flexbox column
   */
  flexColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  /**
   * Absolute fill (cover parent)
   */
  absoluteFill: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  /**
   * Fixed fill (cover viewport)
   */
  fixedFill: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  /**
   * Text truncation
   */
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },

  /**
   * Line clamp (multi-line truncation)
   */
  lineClamp: (lines: number) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  }),

  /**
   * Hide scrollbar but keep scrolling
   */
  hideScrollbar: {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    WebkitOverflowScrolling: 'touch',
    // For Chrome/Safari
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },

  /**
   * Smooth scrolling
   */
  smoothScroll: {
    scrollBehavior: 'smooth' as const,
  },

  /**
   * User select none
   */
  noSelect: {
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
  },

  /**
   * Visually hidden (accessible to screen readers)
   */
  visuallyHidden: {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    border: 0,
  },

  /**
   * Focus ring (for accessibility)
   */
  focusRing: (theme: Theme) => ({
    outline: `2px solid ${theme.colors.border.focus}`,
    outlineOffset: '2px',
  }),

  /**
   * Card-like container
   */
  card: (theme: Theme) => ({
    backgroundColor: theme.colors.surface.elevated,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.sm,
  }),

  /**
   * Interactive element (hover/active states)
   */
  interactive: (theme: Theme) => ({
    cursor: 'pointer',
    transition: theme.transitions.fast,
    ':hover': {
      backgroundColor: theme.colors.interactive.hover,
    },
    ':active': {
      backgroundColor: theme.colors.interactive.active,
    },
  }),
};

/**
 * Responsive style helper
 */
export function responsive(
  mobile: CSSProperties,
  tablet?: CSSProperties,
  desktop?: CSSProperties
): CSSProperties {
  // Note: This is a simplified version. For true responsive styles,
  // you'd need to use media queries in CSS or a CSS-in-JS solution
  return mobile;
}

/**
 * Create a component style hook
 */
export function createStyleHook<P extends object>(
  stylesFn: (props: P, theme: Theme) => Record<string, CSSProperties>
) {
  return (props: P, theme: Theme) => stylesFn(props, theme);
}

/**
 * Alpha channel helper for colors
 */
export function alpha(color: string, opacity: number): string {
  // Simple implementation - for production, use a color manipulation library
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Darken color helper
 */
export function darken(color: string, amount: number): string {
  // Simplified implementation
  return color; // In production, use a proper color library
}

/**
 * Lighten color helper
 */
export function lighten(color: string, amount: number): string {
  // Simplified implementation
  return color; // In production, use a proper color library
}
