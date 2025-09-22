import React from "react";

export type CardProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  padding?: "none" | "small" | "medium" | "large";
  shadow?: "none" | "small" | "medium" | "large";
};

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className,
  style,
  padding = "medium",
  shadow = "small",
}) => {
  const paddingMap = {
    none: "0",
    small: "8px",
    medium: "16px",
    large: "24px",
  };

  const shadowMap = {
    none: "none",
    small: "0 1px 3px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 6px rgba(0, 0, 0, 0.1)",
    large: "0 10px 25px rgba(0, 0, 0, 0.15)",
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: shadowMap[shadow],
        padding: paddingMap[padding],
        ...style,
      }}
    >
      {title && (
        <h3
          style={{
            margin: "0 0 12px 0",
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
