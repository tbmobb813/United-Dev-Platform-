import React from "react";

export type StackProps = {
  children: React.ReactNode;
  direction?: "row" | "column";
  gap?: "none" | "small" | "medium" | "large";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export const Stack: React.FC<StackProps> = ({
  children,
  direction = "column",
  gap = "medium",
  align = "stretch",
  justify = "start",
  wrap = false,
  className,
  style,
}) => {
  const gapMap = {
    none: "0",
    small: "8px",
    medium: "16px",
    large: "24px",
  };

  const alignMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  };

  const justifyMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: direction,
        gap: gapMap[gap],
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export type ContainerProps = {
  children: React.ReactNode;
  maxWidth?: "small" | "medium" | "large" | "full";
  padding?: "none" | "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
};

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = "large",
  padding = "medium",
  className,
  style,
}) => {
  const maxWidthMap = {
    small: "480px",
    medium: "768px",
    large: "1024px",
    full: "100%",
  };

  const paddingMap = {
    none: "0",
    small: "8px",
    medium: "16px",
    large: "24px",
  };

  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: maxWidthMap[maxWidth],
        margin: "0 auto",
        padding: paddingMap[padding],
        ...style,
      }}
    >
      {children}
    </div>
  );
};
