import React from 'react';
import { PresenceIndicator } from './PresenceIndicator';

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
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  isActive?: boolean;
  lastSeen?: Date;
  showPresence?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'medium',
  showName = true,
  isActive = true,
  lastSeen,
  showPresence = true,
}) => {
  const sizeMap = {
    small: '24px',
    medium: '32px',
    large: '40px',
  };

  const fontSize = {
    small: '10px',
    medium: '12px',
    large: '14px',
  };

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <div
          style={{
            width: sizeMap[size],
            height: sizeMap[size],
            borderRadius: '50%',
            backgroundColor: user.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: fontSize[size],
            fontWeight: '600',
            border: isActive ? '2px solid #0070f3' : '2px solid transparent',
            transition: 'all 0.2s ease',
            opacity: isActive ? 1 : 0.7,
          }}
        >
          {initials}
        </div>
        {showPresence && (
          <div style={{ position: 'absolute', bottom: '-2px', right: '-8px' }}>
            <PresenceIndicator
              isActive={isActive}
              lastSeen={lastSeen}
              size={size === 'large' ? 'medium' : 'small'}
              showStatus={false}
            />
          </div>
        )}
      </div>
      {showName && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: isActive ? '#333' : '#666',
              fontWeight: isActive ? '500' : '400',
            }}
          >
            {user.name}
          </div>
          {showPresence && (
            <PresenceIndicator
              isActive={isActive}
              lastSeen={lastSeen}
              size='small'
              showStatus={true}
            />
          )}
          {user.cursor && (
            <span style={{ fontSize: '10px', color: '#999' }}>
              L{user.cursor.line}:C{user.cursor.column}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
