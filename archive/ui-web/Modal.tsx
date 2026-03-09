import React from 'react';
import { Card } from './Card';
import { Stack } from './Layout';
import { Button } from './Button';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  actions,
  className,
  style,
}) => {
  if (!isOpen) {
    return null;
  }

  const sizeMap = {
    small: '400px',
    medium: '600px',
    large: '800px',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={handleBackdropClick}
    >
      <Card
        className={className}
        style={{
          width: '100%',
          maxWidth: sizeMap[size],
          maxHeight: '90vh',
          overflow: 'auto',
          ...style,
        }}
      >
        <Stack gap='medium'>
          {(title || showCloseButton) && (
            <Stack direction='row' justify='between' align='center'>
              {title && (
                <h2
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <Button variant='ghost' size='small' onClick={onClose}>
                  ✕
                </Button>
              )}
            </Stack>
          )}

          <div>{children}</div>

          {actions && (
            <Stack direction='row' justify='end' gap='small'>
              {actions}
            </Stack>
          )}
        </Stack>
      </Card>
    </div>
  );
};
