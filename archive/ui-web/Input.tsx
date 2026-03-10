import React from 'react';

export type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'search';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  className,
  style,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      style={{
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
        ...style,
      }}
      onFocus={e => {
        e.target.style.borderColor = '#0070f3';
      }}
      onBlur={e => {
        e.target.style.borderColor = '#ddd';
      }}
    />
  );
};
