/**
 * Sidebar Types
 *
 * Type definitions for the sidebar navigation system
 */

import React from 'react';

export interface SidebarItem {
  /** Unique identifier */
  id: string;

  /** Display label */
  label: string;

  /** Icon (emoji or component) */
  icon?: string | React.ReactNode;

  /** Click handler */
  onClick?: () => void;

  /** Whether this item is currently active */
  active?: boolean;

  /** Whether this item is disabled */
  disabled?: boolean;

  /** Badge text (e.g., notification count) */
  badge?: string | number;

  /** Keyboard shortcut hint */
  shortcut?: string;
}

export interface SidebarSection {
  /** Section title */
  title?: string;

  /** Items in this section */
  items: SidebarItem[];
}

export interface SidebarProps {
  /** Whether sidebar is collapsed */
  isCollapsed?: boolean;

  /** Callback when collapse state changes */
  onCollapse?: (collapsed: boolean) => void;

  /** Navigation sections */
  sections: SidebarSection[];

  /** Header content (logo, title) */
  header?: React.ReactNode;

  /** Footer content (user profile, settings) */
  footer?: React.ReactNode;

  /** Width when expanded */
  width?: number;

  /** Width when collapsed */
  collapsedWidth?: number;
}
