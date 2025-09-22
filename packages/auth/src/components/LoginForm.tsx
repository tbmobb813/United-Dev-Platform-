/* global HTMLInputElement */
import React, { useState } from 'react';
import type { AuthResult, LoginCredentials } from '../types';

export interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<AuthResult>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  loading?: boolean;
  error?: string;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  showSignUp?: boolean;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onForgotPassword,
  onSignUp,
  loading = false,
  error,
  showRememberMe = true,
  showForgotPassword = true,
  showSignUp = true,
  className = '',
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [formError, setFormError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!credentials.email || !credentials.password) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    try {
      const result = await onLogin(credentials);
      if (!result.success && result.error) {
        setFormError(result.error.message);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials((prev: LoginCredentials) => ({
        ...prev,
        [field]: field === 'rememberMe' ? e.target.checked : e.target.value
      }));
    };

  const displayError = error || formError;

  return (
    <div className={`auth-form login-form ${className}`}>
      <div className='auth-form__header'>
        <h2>Sign In</h2>
        <p>Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className='auth-form__form'>
        {displayError && (
          <div className='auth-form__error' role='alert'>
            {displayError}
          </div>
        )}

        <div className='form-group'>
          <label htmlFor='email' className='form-label'>
            Email Address
          </label>
          <input
            id='email'
            type='email'
            value={credentials.email}
            onChange={handleInputChange('email')}
            placeholder='Enter your email'
            className='form-input'
            required
            disabled={loading}
            autoComplete='email'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='password' className='form-label'>
            Password
          </label>
          <input
            id='password'
            type='password'
            value={credentials.password}
            onChange={handleInputChange('password')}
            placeholder='Enter your password'
            className='form-input'
            required
            disabled={loading}
            autoComplete='current-password'
          />
        </div>

        <div className='form-row'>
          {showRememberMe && (
            <div className='form-group checkbox-group'>
              <label className='checkbox-label'>
                <input
                  type='checkbox'
                  checked={credentials.rememberMe}
                  onChange={handleInputChange('rememberMe')}
                  className='checkbox-input'
                  disabled={loading}
                />
                <span className='checkbox-text'>Remember me</span>
              </label>
            </div>
          )}

          {showForgotPassword && onForgotPassword && (
            <button
              type='button'
              onClick={onForgotPassword}
              className='link-button'
              disabled={loading}
            >
              Forgot password?
            </button>
          )}
        </div>

        <button
          type='submit'
          disabled={loading}
          className='auth-form__submit'
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {showSignUp && onSignUp && (
        <div className='auth-form__footer'>
          <p>
            Don't have an account?{' '}
            <button
              type='button'
              onClick={onSignUp}
              className='link-button'
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;