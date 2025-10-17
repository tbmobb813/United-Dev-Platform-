import React from 'react';

export type LoadingProps = {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text,
  color = '#0070f3',
  className,
  style,
}) => {
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px',
  };

  const spinnerSize = sizeMap[size];

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        ...style,
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `2px solid #f3f4f6`,
          borderTop: `2px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {text && (
        <span
          style={{
            fontSize: '14px',
            color: '#6b7280',
            textAlign: 'center',
          }}
        >
          {text}
        </span>
      )}
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
