import React, { useState } from 'react';
import type { AuthResult, ResetPasswordConfirm, ResetPasswordRequest } from '../types';

export interface PasswordResetFormProps {
  onPasswordReset?: (request: ResetPasswordRequest) => Promise<AuthResult>;
  onPasswordConfirm?: (request: ResetPasswordConfirm) => Promise<AuthResult>;
  onBackToLogin?: () => void;
  mode: 'request' | 'confirm';
  token?: string;
  loading?: boolean;
  error?: string;
  className?: string;
  showBackToLogin?: boolean;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onPasswordReset,
  onPasswordConfirm,
  onBackToLogin,
  mode,
  token = '',
  loading = false,
  error,
  className = '',
  showBackToLogin = true,
}) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain uppercase letters');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain lowercase letters');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain numbers');
    }

    return errors;
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email) {
      setFormError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (!onPasswordReset) {
      setFormError('Password reset functionality not available');
      return;
    }

    try {
      const result = await onPasswordReset({ email });
      if (result.success) {
        setIsSubmitted(true);
      } else if (result.error) {
        setFormError(result.error.message);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to send reset email');
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newPassword || !confirmPassword) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setFormError(passwordErrors[0]);
      return;
    }

    if (!onPasswordConfirm) {
      setFormError('Password confirmation functionality not available');
      return;
    }

    try {
      const result = await onPasswordConfirm({ token, newPassword });
      if (result.success) {
        setIsSubmitted(true);
      } else if (result.error) {
        setFormError(result.error.message);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to reset password');
    }
  };

  const displayError = error || formError;

  if (mode === 'request') {
    if (isSubmitted) {
      return (
        <div className={`auth-form password-reset-form ${className}`}>
          <div className='auth-form__header'>
            <h2>Check Your Email</h2>
            <p>We've sent password reset instructions to your email address.</p>
          </div>

          <div className='auth-form__success'>
            <div className='success-icon'>✓</div>
            <p>
              If an account with email <strong>{email}</strong> exists, 
              you will receive password reset instructions shortly.
            </p>
            <p className='text-secondary'>
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>

          {showBackToLogin && onBackToLogin && (
            <div className='auth-form__footer'>
              <button
                type='button'
                onClick={onBackToLogin}
                className='link-button'
                disabled={loading}
              >
                ← Back to login
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`auth-form password-reset-form ${className}`}>
        <div className='auth-form__header'>
          <h2>Reset Password</h2>
          <p>Enter your email address and we'll send you instructions to reset your password.</p>
        </div>

        <form onSubmit={handleRequestSubmit} className='auth-form__form'>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              className='form-input'
              required
              disabled={loading}
              autoComplete='email'
              autoFocus
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='auth-form__submit'
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>

        {showBackToLogin && onBackToLogin && (
          <div className='auth-form__footer'>
            <button
              type='button'
              onClick={onBackToLogin}
              className='link-button'
              disabled={loading}
            >
              ← Back to login
            </button>
          </div>
        )}
      </div>
    );
  }

  // Confirm mode
  if (isSubmitted) {
    return (
      <div className={`auth-form password-reset-form ${className}`}>
        <div className='auth-form__header'>
          <h2>Password Reset Successful</h2>
          <p>Your password has been successfully reset.</p>
        </div>

        <div className='auth-form__success'>
          <div className='success-icon'>✓</div>
          <p>You can now log in with your new password.</p>
        </div>

        {showBackToLogin && onBackToLogin && (
          <div className='auth-form__footer'>
            <button
              type='button'
              onClick={onBackToLogin}
              className='auth-form__submit'
            >
              Continue to Login
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`auth-form password-reset-form ${className}`}>
      <div className='auth-form__header'>
        <h2>Set New Password</h2>
        <p>Enter your new password below.</p>
      </div>

      <form onSubmit={handleConfirmSubmit} className='auth-form__form'>
        {displayError && (
          <div className='auth-form__error' role='alert'>
            {displayError}
          </div>
        )}

        <div className='form-group'>
          <label htmlFor='newPassword' className='form-label'>
            New Password
          </label>
          <input
            id='newPassword'
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder='Enter new password'
            className='form-input'
            required
            disabled={loading}
            autoComplete='new-password'
            autoFocus
          />
        </div>

        <div className='form-group'>
          <label htmlFor='confirmPassword' className='form-label'>
            Confirm New Password
          </label>
          <input
            id='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm new password'
            className={`form-input ${
              newPassword && confirmPassword && newPassword !== confirmPassword 
                ? 'form-input--error' 
                : ''
            }`}
            required
            disabled={loading}
            autoComplete='new-password'
          />
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <div className='form-feedback form-feedback--error'>
              Passwords do not match
            </div>
          )}
        </div>

        <button
          type='submit'
          disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          className='auth-form__submit'
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      {showBackToLogin && onBackToLogin && (
        <div className='auth-form__footer'>
          <button
            type='button'
            onClick={onBackToLogin}
            className='link-button'
            disabled={loading}
          >
            ← Back to login
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordResetForm;