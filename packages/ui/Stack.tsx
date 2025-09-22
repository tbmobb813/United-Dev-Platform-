import React from "react";

export interface StackProps {
  children: React.ReactNode;
  gap?: "small" | "medium" | "large";
  direction?: "row" | "column";
  wrap?: boolean;
  style?: React.CSSProperties;
}

const gapSizes = {
  small: "8px",
  medium: "16px",
  large: "24px",
};

export const Stack: React.FC<StackProps> = ({
  children,
  gap = "medium",
  direction = "column",
  wrap = false,
  style = {},
}) => {
  const stackStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: direction,
    gap: gapSizes[gap],
    flexWrap: wrap ? "wrap" : "nowrap",
    ...style,
  };

  return <div style={stackStyle}>{children}</div>;
};
