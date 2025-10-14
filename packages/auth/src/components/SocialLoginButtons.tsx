import React from 'react';
// Inline GitHub SVG to avoid adding @mui/icons-material dependency
const GitHubIcon: React.FC = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.76-1.605-2.665-.303-5.466-1.333-5.466-5.93 0-1.31.47-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.137 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.803 5.624-5.475 5.92.43.37.815 1.102.815 2.222 0 1.606-.014 2.903-.014 3.297 0 .32.19.694.8.576C20.565 21.796 24 17.298 24 12c0-6.63-5.373-12-12-12z' />
  </svg>
);

export interface SocialProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  className?: string;
}

export interface SocialLoginButtonsProps {
  providers: SocialProvider[];
  onSocialLogin: (providerId: string) => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined';
  showDivider?: boolean;
  dividerText?: string;
}

const defaultProviders: SocialProvider[] = [
  {
    id: 'github',
    name: 'GitHub',
    icon: <GitHubIcon />,
    className: 'social-button--github',
  },
  {
    id: 'google',
    name: 'Google',
    icon: (
      <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
        <path
          d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
          fill='#4285F4'
        />
        <path
          d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
          fill='#34A853'
        />
        <path
          d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
          fill='#FBBC05'
        />
        <path
          d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
          fill='#EA4335'
        />
      </svg>
    ),
    className: 'social-button--google',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: (
      <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
        <path
          d='M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z'
          fill='#00a1f1'
        />
      </svg>
    ),
    className: 'social-button--microsoft',
  },
];

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  providers = defaultProviders,
  onSocialLogin,
  loading = false,
  disabled = false,
  className = '',
  size = 'medium',
  variant = 'outlined',
  showDivider = true,
  dividerText = 'Or continue with',
}) => {
  const handleSocialLogin = async (providerId: string) => {
    if (disabled || loading) {
      return;
    }

    try {
      await onSocialLogin(providerId);
    } catch (error) {
      console.error(`Social login failed for ${providerId}:`, error);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'social-button--small';
      case 'large':
        return 'social-button--large';
      default:
        return 'social-button--medium';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'contained':
        return 'social-button--contained';
      default:
        return 'social-button--outlined';
    }
  };

  if (!providers.length) {
    return null;
  }

  return (
    <div className={`social-login ${className}`}>
      {showDivider && (
        <div className='social-login__divider'>
          <span className='social-login__divider-line'></span>
          <span className='social-login__divider-text'>{dividerText}</span>
          <span className='social-login__divider-line'></span>
        </div>
      )}

      <div className='social-login__buttons'>
        {providers.map(provider => (
          <button
            key={provider.id}
            type='button'
            onClick={() => handleSocialLogin(provider.id)}
            disabled={disabled || loading}
            className={`
              social-button 
              ${getSizeClasses()} 
              ${getVariantClasses()}
              ${provider.className || ''}
              ${disabled || loading ? 'social-button--disabled' : ''}
            `.trim()}
            aria-label={`Sign in with ${provider.name}`}
          >
            <span className='social-button__icon'>{provider.icon}</span>
            <span className='social-button__text'>{provider.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Individual social button component for more flexibility
export interface SocialButtonProps {
  provider: SocialProvider;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined';
  className?: string;
  fullWidth?: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onClick,
  loading = false,
  disabled = false,
  size = 'medium',
  variant = 'outlined',
  className = '',
  fullWidth = true,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'social-button--small';
      case 'large':
        return 'social-button--large';
      default:
        return 'social-button--medium';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'contained':
        return 'social-button--contained';
      default:
        return 'social-button--outlined';
    }
  };

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        social-button 
        ${getSizeClasses()} 
        ${getVariantClasses()}
        ${provider.className || ''}
        ${fullWidth ? 'social-button--full-width' : ''}
        ${disabled || loading ? 'social-button--disabled' : ''}
        ${className}
      `.trim()}
      aria-label={`Sign in with ${provider.name}`}
    >
      <span className='social-button__icon'>
        {loading ? <div className='social-button__spinner' /> : provider.icon}
      </span>
      <span className='social-button__text'>
        {loading ? 'Connecting...' : `Continue with ${provider.name}`}
      </span>
    </button>
  );
};

// Preset configurations for common providers
export const socialProviders = {
  github: defaultProviders.find(p => p.id === 'github')!,
  google: defaultProviders.find(p => p.id === 'google')!,
  microsoft: defaultProviders.find(p => p.id === 'microsoft')!,
};

export default SocialLoginButtons;
