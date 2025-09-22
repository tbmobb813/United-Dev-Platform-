import React, { useState, useEffect, useCallback } from "react";
import { Card } from "./Card";
import { Stack } from "./Layout";
import { UserAvatar } from "./UserAvatar";
import { Button } from "./Button";

export interface CollaborationPanelProps {
  users: Array<{
    id: string;
    name: string;
    color: string;
    cursor?: {
      line: number;
      column: number;
    };
    isActive?: boolean;
    lastSeen?: Date;
  }>;
  currentUserId: string;
  autoCollapseDelay?: number; // milliseconds, default 30000 (30 seconds)
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  users,
  currentUserId,
  autoCollapseDelay = 30000, // 30 seconds
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const activeUsers = users.filter((user) => user.isActive);
  const inactiveUsers = users.filter((user) => !user.isActive);

  // Reset activity timer when users change
  useEffect(() => {
    setLastActivity(Date.now());
  }, [users.length, activeUsers.length]);

  // Auto-collapse after inactivity
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isCollapsed && activeUsers.length <= 1) {
        setIsCollapsed(true);
      }
    }, autoCollapseDelay);

    return () => window.clearTimeout(timer);
  }, [lastActivity, isCollapsed, activeUsers.length, autoCollapseDelay]);

  // Reset activity on mouse interaction
  const handleInteraction = useCallback(() => {
    setLastActivity(Date.now());
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  }, [isCollapsed]);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
    setLastActivity(Date.now());
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
    setLastActivity(Date.now());
  };

  const formatLastSeen = (date?: Date) => {
    if (!date) return "Unknown";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div
      style={{
        position: "relative",
        width: isMinimized ? "60px" : "280px",
        transition: "width 0.3s ease",
      }}
      onMouseEnter={handleInteraction}
    >
      {/* Header with controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          backgroundColor: "#f8f9fa",
          border: "1px solid #e9ecef",
          borderRadius: isCollapsed ? "6px" : "6px 6px 0 0",
          borderBottom: isCollapsed ? "1px solid #e9ecef" : "none",
        }}
      >
        {!isMinimized && (
          <span
            style={{ fontSize: "14px", fontWeight: "600", color: "#495057" }}
          >
            👥 {users.length} {users.length === 1 ? "User" : "Users"}
          </span>
        )}
        {isMinimized && <span style={{ fontSize: "16px" }}>👥</span>}

        <div style={{ display: "flex", gap: "4px" }}>
          {!isMinimized && (
            <Button
              size="small"
              variant="ghost"
              onClick={toggleCollapsed}
              style={{
                padding: "4px 6px",
                fontSize: "12px",
                minWidth: "auto",
              }}
            >
              {isCollapsed ? "▼" : "▲"}
            </Button>
          )}
          <Button
            size="small"
            variant="ghost"
            onClick={toggleMinimized}
            style={{
              padding: "4px 6px",
              fontSize: "12px",
              minWidth: "auto",
            }}
          >
            {isMinimized ? "→" : "←"}
          </Button>
        </div>
      </div>

      {/* Panel content */}
      {!isCollapsed && !isMinimized && (
        <Card
          style={{
            borderRadius: "0 0 6px 6px",
            borderTop: "none",
          }}
        >
          <Stack gap="medium">
            {/* Active Users */}
            {activeUsers.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#4ade80",
                    marginBottom: "8px",
                  }}
                >
                  🟢 Active ({activeUsers.length})
                </div>
                <Stack gap="small">
                  {activeUsers.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        padding: "8px",
                        borderRadius: "6px",
                        backgroundColor:
                          user.id === currentUserId ? "#f0f8ff" : "#f8f9fa",
                        border:
                          user.id === currentUserId
                            ? "1px solid #0070f3"
                            : "1px solid #e9ecef",
                      }}
                    >
                      <UserAvatar
                        user={user}
                        size="small"
                        showName={true}
                        isActive={true}
                      />
                      {user.id === currentUserId && (
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#0070f3",
                            marginTop: "2px",
                          }}
                        >
                          (You)
                        </div>
                      )}
                    </div>
                  ))}
                </Stack>
              </div>
            )}

            {/* Recently Active Users */}
            {inactiveUsers.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                  }}
                >
                  ⚪ Recently Active ({inactiveUsers.length})
                </div>
                <Stack gap="small">
                  {inactiveUsers.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        padding: "6px",
                        borderRadius: "4px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        opacity: 0.7,
                      }}
                    >
                      <UserAvatar
                        user={user}
                        size="small"
                        showName={false}
                        isActive={false}
                      />
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#666",
                          marginTop: "2px",
                        }}
                      >
                        {user.name} • {formatLastSeen(user.lastSeen)}
                      </div>
                    </div>
                  ))}
                </Stack>
              </div>
            )}

            {/* Empty State */}
            {users.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "#666",
                  fontSize: "12px",
                  padding: "16px",
                }}
              >
                <div>👥</div>
                <div style={{ marginTop: "4px" }}>
                  No other collaborators yet
                </div>
                <div style={{ marginTop: "2px" }}>
                  Share the room to invite others!
                </div>
              </div>
            )}

            {/* Tips */}
            {activeUsers.length > 1 && (
              <div
                style={{
                  fontSize: "10px",
                  color: "#999",
                  textAlign: "center",
                  marginTop: "8px",
                  padding: "8px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                }}
              >
                💡 You can see everyone's cursors and selections in real-time
              </div>
            )}
          </Stack>
        </Card>
      )}

      {/* Auto-collapse indicator */}
      {isCollapsed && !isMinimized && (
        <div
          style={{
            padding: "8px",
            backgroundColor: "#f8f9fa",
            border: "1px solid #e9ecef",
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            fontSize: "10px",
            color: "#666",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={toggleCollapsed}
        >
          Auto-collapsed • Click to expand
        </div>
      )}
    </div>
  );
};
