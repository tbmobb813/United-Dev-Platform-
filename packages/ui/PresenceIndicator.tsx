import React, { useEffect, useState } from 'react';

export interface PresenceIndicatorProps {
  isActive: boolean;
  lastSeen?: Date;
  size?: 'small' | 'medium' | 'large';
  showStatus?: boolean;
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  isActive,
  lastSeen,
  size = 'medium',
  showStatus = true,
}) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastSeen || isActive) {
      return;
    }

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = now.getTime() - lastSeen.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setTimeAgo(`${days}d ago`);
      } else if (hours > 0) {
        setTimeAgo(`${hours}h ago`);
      } else if (minutes > 5) {
        setTimeAgo(`${minutes}m ago`);
      } else {
        setTimeAgo('Just now');
      }
    };

    updateTimeAgo();
    const interval = window.setInterval(updateTimeAgo, 60000); // Update every minute

    return () => {
      window.clearInterval(interval);
    };
  }, [lastSeen, isActive]);

  const sizeMap = {
    small: '6px',
    medium: '8px',
    large: '10px',
  };

  const getStatusColor = () => {
    if (isActive) {
      return '#4ade80'; // Green for active
    }
    if (!lastSeen) {
      return '#9ca3af'; // Gray for unknown
    }

    const minutesAgo = (new Date().getTime() - lastSeen.getTime()) / 60000;
    if (minutesAgo < 5) {
      return '#fbbf24'; // Yellow for recently active
    }
    return '#9ca3af'; // Gray for inactive
  };

  const getStatusText = () => {
    if (isActive) {
      return 'Active';
    }
    if (!lastSeen) {
      return 'Unknown';
    }
    return timeAgo;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          backgroundColor: getStatusColor(),
          borderRadius: '50%',
          border: '1px solid white',
          opacity: isActive ? 1 : 0.7,
          transition: 'all 0.3s ease',
          boxShadow: isActive ? `0 0 8px ${getStatusColor()}` : 'none',
        }}
      />
      {showStatus && (
        <span
          style={{
            fontSize: '10px',
            color: '#666',
            whiteSpace: 'nowrap',
          }}
        >
          {getStatusText()}
        </span>
      )}
    </div>
  );
};
