import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeMode, lightTheme, darkTheme, getTheme } from './theme';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

/**
 * ThemeProvider - Provides theme context to all children
 *
 * Features:
 * - Automatic dark/light mode switching
 * - Persists user preference to localStorage
 * - System preference detection
 * - Smooth transitions between themes
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
  storageKey = 'udp-theme-mode',
}) => {
  // Initialize mode from localStorage or system preference
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return defaultMode;
    }

    // Check localStorage first
    const stored = localStorage.getItem(storageKey);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return defaultMode;
  });

  const [theme, setTheme] = useState<Theme>(() => getTheme(mode));

  // Update theme when mode changes
  useEffect(() => {
    setTheme(getTheme(mode));
    localStorage.setItem(storageKey, mode);

    // Update document class for global styling
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(mode);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        mode === 'dark'
          ? darkTheme.colors.surface.base
          : lightTheme.colors.surface.base
      );
    }
  }, [mode, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: globalThis.MediaQueryListEvent) => {
      // Only auto-switch if user hasn't explicitly set a preference
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        setModeState(e.matches ? 'dark' : 'light');
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [storageKey]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value: ThemeContextValue = {
    theme,
    mode,
    setMode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {/* Global styles for theme */}
      <style jsx global>{`
        :root {
          /* Color variables */
          --color-primary: ${theme.colors.primary[500]};
          --color-surface-base: ${theme.colors.surface.base};
          --color-surface-elevated: ${theme.colors.surface.elevated};
          --color-text-primary: ${theme.colors.text.primary};
          --color-text-secondary: ${theme.colors.text.secondary};
          --color-border-default: ${theme.colors.border.default};

          /* Spacing */
          --spacing-xs: ${theme.spacing[1]};
          --spacing-sm: ${theme.spacing[2]};
          --spacing-md: ${theme.spacing[4]};
          --spacing-lg: ${theme.spacing[6]};
          --spacing-xl: ${theme.spacing[8]};

          /* Typography */
          --font-size-sm: ${theme.fontSize.sm};
          --font-size-base: ${theme.fontSize.base};
          --font-size-lg: ${theme.fontSize.lg};

          /* Border radius */
          --radius-sm: ${theme.borderRadius.sm};
          --radius-md: ${theme.borderRadius.md};
          --radius-lg: ${theme.borderRadius.lg};

          /* Shadows */
          --shadow-sm: ${theme.shadows.sm};
          --shadow-md: ${theme.shadows.md};
          --shadow-lg: ${theme.shadows.lg};

          /* Transitions */
          --transition-fast: ${theme.transitions.fast};
          --transition-base: ${theme.transitions.base};
        }

        * {
          transition:
            background-color ${theme.transitions.base},
            color ${theme.transitions.base},
            border-color ${theme.transitions.base};
        }

        body {
          background-color: ${theme.colors.surface.base};
          color: ${theme.colors.text.primary};
          font-size: ${theme.fontSize.base};
          line-height: ${theme.lineHeight.normal};
          margin: 0;
          padding: 0;
        }

        /* Selection colors */
        ::selection {
          background-color: ${theme.colors.primary[500]};
          color: ${theme.colors.text.inverse};
        }

        /* Focus visible styles for accessibility */
        *:focus-visible {
          outline: 2px solid ${theme.colors.border.focus};
          outline-offset: 2px;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        ::-webkit-scrollbar-track {
          background: ${theme.colors.surface.base};
        }

        ::-webkit-scrollbar-thumb {
          background: ${theme.colors.border.default};
          border-radius: ${theme.borderRadius.md};
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.border.strong};
        }
      `}</style>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme hook - Access theme context
 *
 * @returns Theme context value with current theme and mode controls
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * withTheme HOC - Inject theme props into a component
 */
export function withTheme<P extends object>(
  Component: React.ComponentType<P & { theme: Theme; mode: ThemeMode }>
): React.FC<P> {
  return function ThemedComponent(props: P) {
    const { theme, mode } = useTheme();
    return <Component {...props} theme={theme} mode={mode} />;
  };
}
