import React from 'react';

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        backgroundColor: '#0070f3',
        borderRadius: 4,
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
};