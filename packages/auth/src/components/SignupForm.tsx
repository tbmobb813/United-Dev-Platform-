/* global HTMLInputElement */
import React, { useState } from 'react';
import type { AuthResult, RegisterCredentials } from '../types';

export interface SignupFormProps {
  onSignup: (credentials: RegisterCredentials) => Promise<AuthResult>;
  onSignIn?: () => void;
  loading?: boolean;
  error?: string;
  showTermsAndConditions?: boolean;
  showLogin?: boolean;
  className?: string;
  requireUsername?: boolean;
  requireNames?: boolean;
  inviteCodeRequired?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  onSignIn,
  loading = false,
  error,
  showTermsAndConditions = true,
  showLogin = true,
  className = '',
  requireUsername = false,
  requireNames = false,
  inviteCodeRequired = false,
}) => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    acceptTerms: false,
    inviteCode: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
  }>({ score: 0, feedback: [] });

  const validatePassword = (password: string) => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password must be at least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include uppercase letters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include lowercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include numbers');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include special characters');
    }

    return { score, feedback };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!credentials.email || !credentials.password) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (requireUsername && !credentials.username) {
      setFormError('Username is required');
      return;
    }

    if (requireNames && (!credentials.firstName || !credentials.lastName)) {
      setFormError('First and last name are required');
      return;
    }

    if (inviteCodeRequired && !credentials.inviteCode) {
      setFormError('Invite code is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (credentials.password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (passwordStrength.score < 3) {
      setFormError('Password is too weak. Please choose a stronger password');
      return;
    }

    if (showTermsAndConditions && !credentials.acceptTerms) {
      setFormError('You must accept the terms and conditions');
      return;
    }

    try {
      const result = await onSignup(credentials);
      if (!result.success && result.error) {
        setFormError(result.error.message);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleInputChange =
    (field: keyof RegisterCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'acceptTerms' ? e.target.checked : e.target.value;

      setCredentials(prev => ({
        ...prev,
        [field]: value,
      }));

      // Validate password strength in real-time
      if (field === 'password') {
        const strength = validatePassword(e.target.value);
        setPasswordStrength(strength);
      }
    };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const displayError = error || formError;
  const passwordMatch =
    credentials.password &&
    confirmPassword &&
    credentials.password === confirmPassword;
  const passwordMismatch =
    credentials.password &&
    confirmPassword &&
    credentials.password !== confirmPassword;

  const getStrengthColor = (score: number) => {
    if (score <= 1) {
      return '#ff4444';
    }
    if (score <= 2) {
      return '#ff8800';
    }
    if (score <= 3) {
      return '#ffbb00';
    }
    if (score <= 4) {
      return '#88cc00';
    }
    return '#00cc44';
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) {
      return 'Very Weak';
    }
    if (score <= 2) {
      return 'Weak';
    }
    if (score <= 3) {
      return 'Fair';
    }
    if (score <= 4) {
      return 'Good';
    }
    return 'Strong';
  };

  return (
    <div className={`auth-form signup-form ${className}`}>
      <div className='auth-form__header'>
        <h2>Create Account</h2>
        <p>Sign up to get started with your account</p>
      </div>

      <form onSubmit={handleSubmit} className='auth-form__form'>
        {displayError && (
          <div className='auth-form__error' role='alert'>
            {displayError}
          </div>
        )}

        <div className='form-group'>
          <label htmlFor='email' className='form-label'>
            Email Address *
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

        {requireUsername && (
          <div className='form-group'>
            <label htmlFor='username' className='form-label'>
              Username *
            </label>
            <input
              id='username'
              type='text'
              value={credentials.username}
              onChange={handleInputChange('username')}
              placeholder='Choose a username'
              className='form-input'
              required
              disabled={loading}
              autoComplete='username'
            />
          </div>
        )}

        {requireNames && (
          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='firstName' className='form-label'>
                First Name *
              </label>
              <input
                id='firstName'
                type='text'
                value={credentials.firstName}
                onChange={handleInputChange('firstName')}
                placeholder='First name'
                className='form-input'
                required
                disabled={loading}
                autoComplete='given-name'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='lastName' className='form-label'>
                Last Name *
              </label>
              <input
                id='lastName'
                type='text'
                value={credentials.lastName}
                onChange={handleInputChange('lastName')}
                placeholder='Last name'
                className='form-input'
                required
                disabled={loading}
                autoComplete='family-name'
              />
            </div>
          </div>
        )}

        {inviteCodeRequired && (
          <div className='form-group'>
            <label htmlFor='inviteCode' className='form-label'>
              Invite Code *
            </label>
            <input
              id='inviteCode'
              type='text'
              value={credentials.inviteCode}
              onChange={handleInputChange('inviteCode')}
              placeholder='Enter invite code'
              className='form-input'
              required
              disabled={loading}
            />
          </div>
        )}

        <div className='form-group'>
          <label htmlFor='password' className='form-label'>
            Password *
          </label>
          <input
            id='password'
            type='password'
            value={credentials.password}
            onChange={handleInputChange('password')}
            placeholder='Create a password'
            className='form-input'
            required
            disabled={loading}
            autoComplete='new-password'
          />

          {credentials.password && (
            <div className='password-strength'>
              <div className='password-strength__bar'>
                <div
                  className='password-strength__fill'
                  style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: getStrengthColor(passwordStrength.score),
                  }}
                />
              </div>
              <div className='password-strength__text'>
                <span
                  style={{ color: getStrengthColor(passwordStrength.score) }}
                >
                  {getStrengthText(passwordStrength.score)}
                </span>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <ul className='password-strength__feedback'>
                  {passwordStrength.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='confirmPassword' className='form-label'>
            Confirm Password *
          </label>
          <input
            id='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder='Confirm your password'
            className={`form-input ${
              passwordMismatch ? 'form-input--error' : ''
            } ${passwordMatch ? 'form-input--success' : ''}`}
            required
            disabled={loading}
            autoComplete='new-password'
          />
          {passwordMismatch && (
            <div className='form-feedback form-feedback--error'>
              Passwords do not match
            </div>
          )}
          {passwordMatch && (
            <div className='form-feedback form-feedback--success'>
              Passwords match
            </div>
          )}
        </div>

        {showTermsAndConditions && (
          <div className='form-group checkbox-group'>
            <label className='checkbox-label'>
              <input
                type='checkbox'
                checked={credentials.acceptTerms}
                onChange={handleInputChange('acceptTerms')}
                className='checkbox-input'
                disabled={loading}
                required
              />
              <span className='checkbox-text'>
                I agree to the{' '}
                <a
                  href='/terms'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='link'
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href='/privacy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='link'
                >
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>
        )}

        <button
          type='submit'
          disabled={
            loading || (showTermsAndConditions && !credentials.acceptTerms)
          }
          className='auth-form__submit'
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      {showLogin && onSignIn && (
        <div className='auth-form__footer'>
          <p>
            Already have an account?{' '}
            <button
              type='button'
              onClick={onSignIn}
              className='link-button'
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
