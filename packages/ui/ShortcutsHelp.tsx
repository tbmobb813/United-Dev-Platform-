import React from 'react';
import { Modal } from './Modal';
import { Card } from './Card';
import { Stack } from './Layout';

export interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({
  isOpen,
  onClose,
}) => {
  const shortcuts = [
    { keys: 'Ctrl + S', description: 'Save current file' },
    { keys: 'Ctrl + O', description: 'Open file' },
    { keys: 'Ctrl + N', description: 'Create new file' },
    { keys: 'Ctrl + K', description: 'Open AI Assistant' },
    { keys: 'Ctrl + F', description: 'Find in file' },
    { keys: 'Ctrl + Shift + P', description: 'Open command palette' },
    { keys: 'Ctrl + ,', description: 'Open settings' },
    { keys: 'F1', description: 'Show keyboard shortcuts' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      size="medium"
    >
      <Stack gap="medium">
        {shortcuts.map((shortcut, index) => (
          <Card key={index} padding="small">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                {shortcut.keys}
              </span>
              <span style={{ color: '#666' }}>{shortcut.description}</span>
            </div>
          </Card>
        ))}
        <div
          style={{
            fontSize: '12px',
            color: '#999',
            textAlign: 'center',
            marginTop: '16px',
          }}
        >
          💡 Tip: Most shortcuts work when the editor is focused
        </div>
      </Stack>
    </Modal>
  );
};
