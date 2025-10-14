import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Stack } from './Layout';
import { PresenceIndicator } from './PresenceIndicator';
import { UserAvatar } from './UserAvatar';

export interface EnhancedPresencePanelProps {
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
  onUserClick?: (userId: string) => void;
  showActivityFeed?: boolean;
}

interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  action: 'joined' | 'left' | 'typing' | 'idle';
  timestamp: Date;
}

export const EnhancedPresencePanel: React.FC<EnhancedPresencePanelProps> = ({
  users,
  currentUserId,
  onUserClick,
  showActivityFeed = true,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);

  // Track user activity changes
  useEffect(() => {
    // Add activity items for new joins/leaves (simplified for demo)
    users.forEach(user => {
      if (user.id !== currentUserId) {
        const existingActivity = activityFeed.find(
          a =>
            a.userId === user.id && a.timestamp > new Date(Date.now() - 60000)
        );

        if (!existingActivity) {
          const newActivity: ActivityItem = {
            id: `${user.id}-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            action: user.isActive ? 'joined' : 'left',
            timestamp: new Date(),
          };

          setActivityFeed(prev => [newActivity, ...prev].slice(0, 10)); // Keep last 10 items
        }
      }
    });
  }, [users, currentUserId, activityFeed]);

  const activeUsers = users.filter(u => u.isActive);
  const recentUsers = users.filter(u => !u.isActive && u.lastSeen);

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card title={`Collaboration (${users.length})`} padding='medium'>
      <Stack gap='medium'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            variant='ghost'
            size='small'
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? 'Show Details ▼' : 'Hide Details ▲'}
          </Button>
        </div>

        {!isCollapsed && (
          <>
            {/* Active Users Section */}
            {activeUsers.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px',
                  }}
                >
                  Active Now ({activeUsers.length})
                </div>
                <Stack gap='small'>
                  {activeUsers.map(user => (
                    <div
                      key={user.id}
                      style={{ cursor: onUserClick ? 'pointer' : 'default' }}
                      onClick={() => onUserClick?.(user.id)}
                    >
                      <UserAvatar
                        user={user}
                        isActive={true}
                        lastSeen={user.lastSeen}
                        showPresence={true}
                        size='medium'
                      />
                    </div>
                  ))}
                </Stack>
              </div>
            )}

            {/* Recently Active Users */}
            {recentUsers.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '8px',
                  }}
                >
                  Recently Active ({recentUsers.length})
                </div>
                <Stack gap='small'>
                  {recentUsers.map(user => (
                    <div
                      key={user.id}
                      style={{ cursor: onUserClick ? 'pointer' : 'default' }}
                      onClick={() => onUserClick?.(user.id)}
                    >
                      <UserAvatar
                        user={user}
                        isActive={false}
                        lastSeen={user.lastSeen}
                        showPresence={true}
                        size='medium'
                      />
                    </div>
                  ))}
                </Stack>
              </div>
            )}

            {/* Activity Feed */}
            {showActivityFeed && activityFeed.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '8px',
                  }}
                >
                  Recent Activity
                </div>
                <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                  <Stack gap='small'>
                    {activityFeed.slice(0, 5).map(activity => (
                      <div
                        key={activity.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '4px 8px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: '#666',
                        }}
                      >
                        <PresenceIndicator
                          isActive={activity.action === 'joined'}
                          size='small'
                          showStatus={false}
                        />
                        <span>
                          <strong>{activity.userName}</strong> {activity.action}{' '}
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    ))}
                  </Stack>
                </div>
              </div>
            )}

            {/* Stats */}
            <div
              style={{
                fontSize: '11px',
                color: '#999',
                padding: '8px 0',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{activeUsers.length} active</span>
              <span>{users.length} total</span>
            </div>
          </>
        )}
      </Stack>
    </Card>
  );
};
