import React, { useState } from 'react';
import { Button } from './Button';
import { EnhancedPresencePanel } from './EnhancedPresencePanel';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  autoCollapseDelay = 30000, // 30 seconds - unused but kept for API compatibility
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: isMinimized ? '60px' : '280px',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Header with controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '6px 6px 0 0',
          borderBottom: 'none',
        }}
      >
        {!isMinimized && (
          <span
            style={{ fontSize: '14px', fontWeight: '600', color: '#495057' }}
          >
            👥 Collaboration
          </span>
        )}
        {isMinimized && <span style={{ fontSize: '16px' }}>👥</span>}

        <div style={{ display: 'flex', gap: '4px' }}>
          <Button
            size='small'
            variant='ghost'
            onClick={toggleMinimized}
            style={{
              padding: '4px 6px',
              fontSize: '12px',
              minWidth: 'auto',
            }}
          >
            {isMinimized ? '→' : '←'}
          </Button>
        </div>
      </div>

      {/* Enhanced panel content */}
      {!isMinimized && (
        <div style={{ borderRadius: '0 0 6px 6px' }}>
          <EnhancedPresencePanel
            users={users}
            currentUserId={currentUserId}
            showActivityFeed={true}
            onUserClick={(userId) => {
              // Could implement user focus/navigation here
              // For now, we'll just ignore the click
              void userId;
            }}
          />
        </div>
      )}
    </div>
  );
};
