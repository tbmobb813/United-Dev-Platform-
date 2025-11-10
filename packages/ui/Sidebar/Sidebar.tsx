import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeProvider';
import { SidebarProps, SidebarItem } from './types';

/**
 * Sidebar - Modern collapsible navigation sidebar
 *
 * Features:
 * - Collapsible/expandable with smooth transitions
 * - Theme-aware styling
 * - Active state highlighting
 * - Badge support for notifications
 * - Keyboard shortcut hints
 * - Customizable header and footer
 */
export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed: controlledCollapsed,
  onCollapse,
  sections,
  header,
  footer,
  width = 240,
  collapsedWidth = 60,
}) => {
  const { theme } = useTheme();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Use controlled or internal collapsed state
  const isCollapsed =
    controlledCollapsed !== undefined
      ? controlledCollapsed
      : internalCollapsed;

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    if (onCollapse) {
      onCollapse(newCollapsed);
    } else {
      setInternalCollapsed(newCollapsed);
    }
  };

  // Persist collapse state
  useEffect(() => {
    if (controlledCollapsed === undefined) {
      const stored = localStorage.getItem('udp-sidebar-collapsed');
      if (stored !== null) {
        setInternalCollapsed(stored === 'true');
      }
    }
  }, [controlledCollapsed]);

  useEffect(() => {
    if (controlledCollapsed === undefined) {
      localStorage.setItem('udp-sidebar-collapsed', String(internalCollapsed));
    }
  }, [internalCollapsed, controlledCollapsed]);

  // Styles
  const sidebarStyle: React.CSSProperties = {
    width: isCollapsed ? `${collapsedWidth}px` : `${width}px`,
    height: '100vh',
    backgroundColor: theme.colors.surface.base,
    borderRight: `1px solid ${theme.colors.border.default}`,
    display: 'flex',
    flexDirection: 'column',
    transition: theme.transitions.normal,
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: theme.zIndex.header,
    overflowX: 'hidden',
    overflowY: 'auto',
  };

  const headerStyle: React.CSSProperties = {
    padding: theme.spacing[4],
    borderBottom: `1px solid ${theme.colors.border.default}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${theme.spacing[2]} 0`,
  };

  const footerStyle: React.CSSProperties = {
    padding: theme.spacing[4],
    borderTop: `1px solid ${theme.colors.border.default}`,
    flexShrink: 0,
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: theme.spacing[4],
  };

  const sectionTitleStyle: React.CSSProperties = {
    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    opacity: isCollapsed ? 0 : 1,
    transition: theme.transitions.fast,
    whiteSpace: 'nowrap',
  };

  const toggleButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: theme.spacing[2],
    cursor: 'pointer',
    color: theme.colors.text.secondary,
    borderRadius: theme.borderRadius.sm,
    transition: theme.transitions.fast,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <aside style={sidebarStyle}>
      {/* Header */}
      {header && (
        <div style={headerStyle}>
          {!isCollapsed && <div style={{ flex: 1 }}>{header}</div>}
          <button
            style={toggleButtonStyle}
            onClick={handleToggleCollapse}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                theme.colors.interactive.hover;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      )}

      {/* Content */}
      <div style={contentStyle}>
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} style={sectionStyle}>
            {section.title && !isCollapsed && (
              <div style={sectionTitleStyle}>{section.title}</div>
            )}
            {section.items.map(item => (
              <SidebarItemComponent
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      {footer && <div style={footerStyle}>{footer}</div>}
    </aside>
  );
};

/**
 * SidebarItemComponent - Individual sidebar navigation item
 */
const SidebarItemComponent: React.FC<{
  item: SidebarItem;
  isCollapsed: boolean;
}> = ({ item, isCollapsed }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[3],
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    margin: `${theme.spacing[1]} ${theme.spacing[2]}`,
    borderRadius: theme.borderRadius.md,
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    transition: theme.transitions.fast,
    color: item.active
      ? theme.colors.text.primary
      : item.disabled
        ? theme.colors.text.disabled
        : theme.colors.text.secondary,
    backgroundColor: item.active
      ? theme.colors.interactive.focus
      : isHovered && !item.disabled
        ? theme.colors.interactive.hover
        : 'transparent',
    fontWeight: item.active ? theme.fontWeight.semibold : theme.fontWeight.medium,
    fontSize: theme.fontSize.sm,
    opacity: item.disabled ? 0.5 : 1,
    position: 'relative',
    whiteSpace: 'nowrap',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: theme.fontSize.xl,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const labelStyle: React.CSSProperties = {
    flex: 1,
    opacity: isCollapsed ? 0 : 1,
    transition: theme.transitions.fast,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: theme.colors.semantic.danger,
    color: 'white',
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    padding: `2px ${theme.spacing[2]}`,
    borderRadius: theme.borderRadius.full,
    minWidth: '20px',
    textAlign: 'center',
    opacity: isCollapsed ? 0 : 1,
    transition: theme.transitions.fast,
  };

  const shortcutStyle: React.CSSProperties = {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.tertiary,
    backgroundColor: theme.colors.surface.inset,
    padding: `2px ${theme.spacing[2]}`,
    borderRadius: theme.borderRadius.sm,
    fontFamily: 'monospace',
    opacity: isCollapsed ? 0 : 1,
    transition: theme.transitions.fast,
  };

  return (
    <div
      style={itemStyle}
      onClick={item.disabled ? undefined : item.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role='button'
      tabIndex={item.disabled ? -1 : 0}
      aria-disabled={item.disabled}
      aria-current={item.active ? 'page' : undefined}
      onKeyDown={e => {
        if (
          !item.disabled &&
          (e.key === 'Enter' || e.key === ' ') &&
          item.onClick
        ) {
          e.preventDefault();
          item.onClick();
        }
      }}
    >
      {item.icon && <div style={iconStyle}>{item.icon}</div>}
      <div style={labelStyle}>{item.label}</div>
      {item.badge && <div style={badgeStyle}>{item.badge}</div>}
      {item.shortcut && <div style={shortcutStyle}>{item.shortcut}</div>}
    </div>
  );
};
