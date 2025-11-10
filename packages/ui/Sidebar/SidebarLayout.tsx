import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeProvider';
import { Sidebar } from './Sidebar';
import { SidebarProps } from './types';

export interface SidebarLayoutProps {
  /** Sidebar configuration */
  sidebar: Omit<SidebarProps, 'isCollapsed' | 'onCollapse'>;

  /** Main content */
  children: React.ReactNode;

  /** Whether to persist sidebar state */
  persistState?: boolean;

  /** Storage key for persisting state */
  storageKey?: string;
}

/**
 * SidebarLayout - Layout component with sidebar and main content area
 *
 * Features:
 * - Responsive layout with sidebar and content
 * - Automatic spacing adjustment when sidebar collapses
 * - State persistence in localStorage
 * - Theme-aware styling
 */
export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  sidebar,
  children,
  persistState = true,
  storageKey = 'udp-sidebar-collapsed',
}) => {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load persisted state
  useEffect(() => {
    if (persistState) {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    }
  }, [persistState, storageKey]);

  // Persist state changes
  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    if (persistState) {
      localStorage.setItem(storageKey, String(collapsed));
    }
  };

  const sidebarWidth = sidebar.width || 240;
  const sidebarCollapsedWidth = sidebar.collapsedWidth || 60;

  const mainStyle: React.CSSProperties = {
    marginLeft: isCollapsed
      ? `${sidebarCollapsedWidth}px`
      : `${sidebarWidth}px`,
    minHeight: '100vh',
    transition: theme.transitions.normal,
    backgroundColor: theme.colors.surface.base,
  };

  return (
    <>
      <Sidebar
        {...sidebar}
        isCollapsed={isCollapsed}
        onCollapse={handleCollapse}
      />
      <main style={mainStyle}>{children}</main>
    </>
  );
};
