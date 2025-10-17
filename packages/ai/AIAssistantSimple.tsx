/** @jsxImportSource react */
import React from 'react';

export interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentFile?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  currentFile,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 24,
          width: '90%',
          maxWidth: 800,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0 }}>{'🤖 AI Assistant'}</h2>
          <button
            onClick={onClose}
            aria-label={'Close'}
            style={{ fontSize: 20 }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: 12 }}>
          <p>{currentFile ? `File: ${currentFile}` : 'AI Assistant ready.'}</p>
          <p>
            {
              'This is a simplified AI assistant placeholder used by the editor.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
