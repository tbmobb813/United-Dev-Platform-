import React from "react";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  className,
  style,
}) => {
  const sizeMap = {
    small: { padding: "6px 12px", fontSize: "12px" },
    medium: { padding: "8px 16px", fontSize: "14px" },
    large: { padding: "12px 20px", fontSize: "16px" },
  };

  const variantMap = {
    primary: {
      backgroundColor: "#0070f3",
      color: "#fff",
      border: "1px solid #0070f3",
    },
    secondary: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      border: "1px solid #d1d5db",
    },
    outline: {
      backgroundColor: "transparent",
      color: "#0070f3",
      border: "1px solid #0070f3",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "#374151",
      border: "1px solid transparent",
    },
    danger: {
      backgroundColor: "#ef4444",
      color: "#fff",
      border: "1px solid #ef4444",
    },
  };

  const baseStyle = {
    ...sizeMap[size],
    ...variantMap[variant],
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.2s",
    fontWeight: "500",
    outline: "none",
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      style={{
        ...baseStyle,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = "0.9";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = "1";
        }
      }}
    >
      {children}
    </button>
  );
};
