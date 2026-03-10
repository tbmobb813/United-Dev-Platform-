import React from 'react';
import { useTheme } from './ThemeProvider';
import { mergeStyles } from './styled';

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className,
  style,
  fullWidth = false,
  loading = false,
}) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  // Size configurations using theme spacing
  const sizeStyles: Record<string, React.CSSProperties> = {
    small: {
      padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
      fontSize: theme.fontSize.xs,
      height: '32px',
    },
    medium: {
      padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
      fontSize: theme.fontSize.sm,
      height: '40px',
    },
    large: {
      padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
      fontSize: theme.fontSize.base,
      height: '48px',
    },
  };

  // Variant configurations using theme colors
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: theme.colors.primary[500],
      color: theme.colors.text.inverse,
      border: `1px solid ${theme.colors.primary[500]}`,
    },
    secondary: {
      backgroundColor: theme.colors.surface.elevated,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.default}`,
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.primary[500],
      border: `1px solid ${theme.colors.primary[500]}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.text.primary,
      border: '1px solid transparent',
    },
    danger: {
      backgroundColor: theme.colors.danger[500],
      color: theme.colors.text.inverse,
      border: `1px solid ${theme.colors.danger[500]}`,
    },
  };

  // Hover state styles
  const getHoverStyle = (variant: string): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: theme.colors.primary[600] };
      case 'secondary':
        return { backgroundColor: theme.colors.interactive.hover };
      case 'outline':
        return {
          backgroundColor: theme.colors.interactive.focus,
          borderColor: theme.colors.primary[600],
        };
      case 'ghost':
        return { backgroundColor: theme.colors.interactive.hover };
      case 'danger':
        return { backgroundColor: theme.colors.danger[700] };
      default:
        return {};
    }
  };

  // Base styles
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    transition: theme.transitions.fast,
    fontWeight: theme.fontWeight.medium,
    outline: 'none',
    position: 'relative',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    width: fullWidth ? '100%' : 'auto',
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const interactiveStyle: React.CSSProperties =
    isHovered && !isDisabled ? getHoverStyle(variant) : {};

  const activeStyle: React.CSSProperties =
    isPressed && !isDisabled ? { transform: 'scale(0.98)' } : {};

  const finalStyle = mergeStyles(
    baseStyle,
    interactiveStyle,
    activeStyle,
    style
  );

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={className}
      style={finalStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onFocus={e => {
        // Add focus visible outline for accessibility
        if (!isDisabled) {
          e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.interactive.focus}`;
        }
      }}
      onBlur={e => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {loading && (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: `2px solid ${
              variant === 'primary' || variant === 'danger'
                ? theme.colors.text.inverse
                : theme.colors.primary[500]
            }`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
};
