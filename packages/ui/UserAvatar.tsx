import React from "react";

export interface UserAvatarProps {
  user: {
    id: string;
    name: string;
    color: string;
    cursor?: {
      line: number;
      column: number;
    };
  };
  size?: "small" | "medium" | "large";
  showName?: boolean;
  isActive?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "medium",
  showName = true,
  isActive = true,
}) => {
  const sizeMap = {
    small: "24px",
    medium: "32px",
    large: "40px",
  };

  const fontSize = {
    small: "10px",
    medium: "12px",
    large: "14px",
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: "50%",
          backgroundColor: user.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: fontSize[size],
          fontWeight: "600",
          position: "relative",
          border: isActive ? "2px solid #0070f3" : "2px solid transparent",
          transition: "all 0.2s ease",
        }}
      >
        {initials}
        {isActive && (
          <div
            style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              width: "8px",
              height: "8px",
              backgroundColor: "#4ade80",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        )}
      </div>
      {showName && (
        <div
          style={{
            fontSize: "12px",
            color: isActive ? "#333" : "#666",
            fontWeight: isActive ? "500" : "400",
          }}
        >
          {user.name}
          {user.cursor && (
            <span
              style={{ fontSize: "10px", color: "#999", marginLeft: "4px" }}
            >
              L{user.cursor.line}:C{user.cursor.column}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
