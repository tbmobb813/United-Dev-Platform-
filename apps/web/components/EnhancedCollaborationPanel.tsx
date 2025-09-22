import { getConfig } from '@udp/config';
import { UserPresence } from '@udp/editor-core';
import React, { useEffect, useState } from 'react';

// Simple CollaboratorPresence component
interface CollaboratorPresenceProps {
  collaborators: UserPresence[];
  maxVisible?: number;
  showNames?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CollaboratorPresence: React.FC<CollaboratorPresenceProps> = ({
  collaborators,
  maxVisible = 5,
  showNames = true,
  size = 'md',
}) => {
  const sizeMap = {
    sm: '24px',
    md: '32px',
    lg: '40px',
  };

  const visibleCollaborators = collaborators.slice(0, maxVisible);
  const remainingCount = collaborators.length - maxVisible;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {visibleCollaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            style={{
              width: sizeMap[size],
              height: sizeMap[size],
              borderRadius: '50%',
              backgroundColor: collaborator.color,
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: size === 'sm' ? '10px' : '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            title={collaborator.name}
          >
            {collaborator.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            style={{
              width: sizeMap[size],
              height: sizeMap[size],
              borderRadius: '50%',
              backgroundColor: '#6b7280',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: size === 'sm' ? '10px' : '12px',
              fontWeight: '600',
            }}
            title={`+${remainingCount} more`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
      {showNames && (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {visibleCollaborators.map((collaborator, index) => (
            <span key={collaborator.id}>
              {collaborator.name}
              {index < visibleCollaborators.length - 1 && ', '}
            </span>
          ))}
          {remainingCount > 0 && ` and ${remainingCount} more`}
        </div>
      )}
    </div>
  );
};

interface EnhancedCollaborationPanelProps {
  collaborators: UserPresence[];
  onToggleCollapse?: (collapsed: boolean) => void;
}

export const EnhancedCollaborationPanel: React.FC<
  EnhancedCollaborationPanelProps
> = ({ collaborators, onToggleCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showAutoCollapseHint, setShowAutoCollapseHint] = useState(false);

  const config = getConfig();

  // Auto-collapse after 30 seconds if only 1 user and no activity
  useEffect(() => {
    if (collaborators.length <= 1 && config.maxCollaborators > 1) {
      const timer = setTimeout(() => {
        if (Date.now() - lastActivity > 30000) {
          setIsCollapsed(true);
          setShowAutoCollapseHint(true);
          onToggleCollapse?.(true);

          // Hide hint after 3 seconds
          setTimeout(() => setShowAutoCollapseHint(false), 3000);
        }
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [
    collaborators.length,
    lastActivity,
    config.maxCollaborators,
    onToggleCollapse,
  ]);

  // Reset activity timer on mouse events
  const handleActivity = () => {
    setLastActivity(Date.now());
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setShowAutoCollapseHint(false);
    onToggleCollapse?.(!isCollapsed);
    handleActivity();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    handleActivity();
  };

  if (config.maxCollaborators <= 1) {
    return null;
  }

  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: isMinimized ? '8px' : '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    width: isCollapsed ? '200px' : isMinimized ? '60px' : '300px',
    zIndex: 1000,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: isMinimized ? 0 : '12px',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  };

  const buttonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    color: '#6b7280',
    fontSize: '12px',
  };

  const hintStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-30px',
    right: '0',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    opacity: showAutoCollapseHint ? 1 : 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  };

  if (isMinimized) {
    return (
      <div style={containerStyles} onMouseEnter={handleActivity}>
        <div style={{ textAlign: 'center' }}>
          <button style={buttonStyles} onClick={toggleMinimize} title='Expand'>
            👥
          </button>
          <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
            {collaborators.length}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles} onMouseEnter={handleActivity}>
      {showAutoCollapseHint && (
        <div style={hintStyles}>Auto-collapsed • Click to expand</div>
      )}

      <div style={headerStyles}>
        <h3 style={titleStyles}>
          {collaborators.length} User{collaborators.length !== 1 ? 's' : ''}
        </h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            style={buttonStyles}
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
          <button
            style={buttonStyles}
            onClick={toggleMinimize}
            title='Minimize'
          >
            −
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div style={{ transition: 'opacity 0.3s ease' }}>
          <CollaboratorPresence
            collaborators={collaborators}
            maxVisible={5}
            showNames={true}
            size='sm'
          />

          {collaborators.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '12px',
                padding: '20px 0',
              }}
            >
              {config.maxCollaborators > 1
                ? 'Share the QR code to invite collaborators'
                : 'Real-time collaboration disabled'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
