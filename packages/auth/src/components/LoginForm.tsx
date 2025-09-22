import React, { useState } from 'react';import React, { useState } from 'react';import React, { useState } from 'react';import React, { useState } from 'react';

import type { LoginCredentials, AuthResult } from '../types';

import type { LoginCredentials, AuthResult } from '../types';

export interface LoginFormProps {

  onLogin: (credentials: LoginCredentials) => Promise<AuthResult>;

  loading?: boolean;

  error?: string;export interface LoginFormProps {

}

  onLogin: (credentials: LoginCredentials) => Promise<AuthResult>;import type { LoginCredentials, AuthResult } from '../types';import type { LoginCredentials, AuthResult } from '../types';

export const LoginForm: React.FC<LoginFormProps> = ({

  onLogin,  onForgotPassword?: () => void;

  loading = false,

  error  onSignUp?: () => void;

}) => {

  const [credentials, setCredentials] = useState<LoginCredentials>({  loading?: boolean;

    email: '',

    password: ''  error?: string;export interface LoginFormProps {export interface LoginFormProps {

  });

  showRememberMe?: boolean;

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();  showForgotPassword?: boolean;  onLogin: (credentials: LoginCredentials) => Promise<AuthResult>;  onLogin: (credentials: LoginCredentials) => Promise<AuthResult>;

    await onLogin(credentials);

  };  showSignUp?: boolean;



  return (  className?: string;  onForgotPassword?: () => void;  onForgotPassword?: () => void;

    <form onSubmit={handleSubmit}>

      <input}

        type="email"

        value={credentials.email}  onSignUp?: () => void;

        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}

        placeholder="Email"export const LoginForm: React.FC<LoginFormProps> = ({

        required

      />  onLogin,  loading?: boolean;  onSignUp?: () => void;  onSignUp?: () => void;

      <input

        type="password"  onForgotPassword,

        value={credentials.password}

        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}  onSignUp,  error?: string;

        placeholder="Password"

        required  loading = false,

      />

      <button type="submit" disabled={loading}>  error,  showRememberMe?: boolean;  loading?: boolean;  loading?: boolean;

        {loading ? 'Signing in...' : 'Sign In'}

      </button>  showRememberMe = true,

      {error && <div className="error">{error}</div>}

    </form>  showForgotPassword = true,  showForgotPassword?: boolean;

  );

};  showSignUp = true,



export default LoginForm;  className = '',  showSignUp?: boolean;  error?: string;  error?: string;

}) => {

  const [credentials, setCredentials] = useState<LoginCredentials>({  className?: string;

    email: '',

    password: '',}  showRememberMe?: boolean;  showRememberMe?: boolean;

    rememberMe: false,

  });



  const [formError, setFormError] = useState<string>('');export const LoginForm: React.FC<LoginFormProps> = ({  showForgotPassword?: boolean;  showForgotPassword?: boolean;



  const handleSubmit = async (e: React.FormEvent) => {  onLogin,

    e.preventDefault();

    setFormError('');  onForgotPassword,  showSignUp?: boolean;  showSignUp?: boolean;



    if (!credentials.email || !credentials.password) {  onSignUp,

      setFormError('Please fill in all required fields');

      return;  loading = false,  className?: string;  className?: string;

    }

  error,

    if (!/\S+@\S+\.\S+/.test(credentials.email)) {

      setFormError('Please enter a valid email address');  showRememberMe = true,}}

      return;

    }  showForgotPassword = true,



    try {  showSignUp = true,

      const result = await onLogin(credentials);

      if (!result.success) {  className = '',

        setFormError(result.error?.message || 'Login failed');

      }}) => {export const LoginForm: React.FC<LoginFormProps> = ({export const LoginForm: React.FC<LoginFormProps> = ({

    } catch (err) {

      setFormError(err instanceof Error ? err.message : 'An unexpected error occurred');  const [credentials, setCredentials] = useState<LoginCredentials>({

    }

  };    email: '',  onLogin,  onLogin,



  const handleInputChange = (field: keyof LoginCredentials) => (    password: '',

    e: React.ChangeEvent<HTMLInputElement>

  ) => {    rememberMe: false,  onForgotPassword,  onForgotPassword,

    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setCredentials(prev => ({  });

      ...prev,

      [field]: value,  onSignUp,  onSignUp,

    }));

  };  const [formError, setFormError] = useState<string>('');



  const displayError = error || formError;  loading = false,  loading = false,



  return (  const handleSubmit = async (e: React.FormEvent) => {

    <div className={`login-form ${className}`}>

      <form onSubmit={handleSubmit}>    e.preventDefault();  error,  error,

        <div className="form-group">

          <label htmlFor="email">Email Address *</label>    setFormError('');

          <input

            id="email"  showRememberMe = true,  showRememberMe = true,

            type="email"

            value={credentials.email}    // Basic validation

            onChange={handleInputChange('email')}

            placeholder="Enter your email"    if (!credentials.email || !credentials.password) {  showForgotPassword = true,  showForgotPassword = true,

            required

            disabled={loading}      setFormError('Please fill in all required fields');

            autoComplete="email"

          />      return;  showSignUp = true,  showSignUp = true,

        </div>

    }

        <div className="form-group">

          <label htmlFor="password">Password *</label>  className = ''  className = ''

          <input

            id="password"    if (!/\S+@\S+\.\S+/.test(credentials.email)) {

            type="password"

            value={credentials.password}      setFormError('Please enter a valid email address');}) => {}) => {

            onChange={handleInputChange('password')}

            placeholder="Enter your password"      return;

            required

            disabled={loading}    }  const [credentials, setCredentials] = useState<LoginCredentials>({  const [credentials, setCredentials] = useState<LoginCredentials>({

            autoComplete="current-password"

          />

        </div>

    try {    email: '',    email: '',

        {showRememberMe && (

          <div className="form-group checkbox">      const result = await onLogin(credentials);

            <label>

              <input      if (!result.success) {    password: '',    password: '',

                type="checkbox"

                checked={credentials.rememberMe || false}        setFormError(result.error?.message || 'Login failed');

                onChange={handleInputChange('rememberMe')}

                disabled={loading}      }    rememberMe: false    rememberMe: false

              />

              Remember me    } catch (err) {

            </label>

          </div>      setFormError(err instanceof Error ? err.message : 'An unexpected error occurred');  });  });

        )}

    }

        {displayError && (

          <div className="error-message">  };  const [formError, setFormError] = useState<string>('');  const [formError, setFormError] = useState<string>('');

            {displayError}

          </div>

        )}

  const handleInputChange = (field: keyof LoginCredentials) => (

        <div className="form-actions">

          <button    e: React.ChangeEvent<HTMLInputElement>

            type="submit"

            disabled={loading}  ) => {  const handleSubmit = async (e: React.FormEvent) => {  const handleSubmit = async (e: React.FormEvent) => {

            className={`login-button ${loading ? 'loading' : ''}`}

          >    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

            {loading ? 'Signing in...' : 'Sign In'}

          </button>    setCredentials(prev => ({    e.preventDefault();    e.preventDefault();

        </div>

      ...prev,

        <div className="form-links">

          {showForgotPassword && onForgotPassword && (      [field]: value,    setFormError('');    setFormError('');

            <button

              type="button"    }));

              onClick={onForgotPassword}

              disabled={loading}  };

              className="link-button"

            >

              Forgot your password?

            </button>  const displayError = error || formError;    if (!credentials.email || !credentials.password) {    if (!credentials.email || !credentials.password) {

          )}



          {showSignUp && onSignUp && (

            <div className="signup-link">  return (      setFormError('Please fill in all required fields');      setFormError('Please fill in all required fields');

              <p>

                Don't have an account?{' '}    <div className={`login-form ${className}`}>

                <button

                  type="button"      <form onSubmit={handleSubmit}>      return;      return;

                  onClick={onSignUp}

                  disabled={loading}        <div className="form-group">

                  className="link-button"

                >          <label htmlFor="email">Email Address *</label>    }    }

                  Sign up

                </button>          <input

              </p>

            </div>            id="email"

          )}

        </div>            type="email"

      </form>

    </div>            value={credentials.email}    try {    try {

  );

};            onChange={handleInputChange('email')}



export default LoginForm;            placeholder="Enter your email"      const result = await onLogin(credentials);      const result = await onLogin(credentials);

            required

            disabled={loading}      if (!result.success && result.error) {      if (!result.success && result.error) {

            autoComplete="email"

          />        setFormError(result.error.message);        setFormError(result.error.message);

        </div>

      }      }

        <div className="form-group">

          <label htmlFor="password">Password *</label>    } catch (err) {    } catch (err) {

          <input

            id="password"      setFormError(err instanceof Error ? err.message : 'Login failed');      setFormError(err instanceof Error ? err.message : 'Login failed');

            type="password"

            value={credentials.password}    }    }

            onChange={handleInputChange('password')}

            placeholder="Enter your password"  };  };

            required

            disabled={loading}

            autoComplete="current-password"

          />  const handleInputChange = (field: keyof LoginCredentials) =>   const handleInputChange = (field: keyof LoginCredentials) => 

        </div>

    (e: React.ChangeEvent<HTMLInputElement>) => {    (e: React.ChangeEvent<HTMLInputElement>) => {

        {showRememberMe && (

          <div className="form-group checkbox">      setCredentials(prev => ({      setCredentials(prev => ({

            <label>

              <input        ...prev,        ...prev,

                type="checkbox"

                checked={credentials.rememberMe || false}        [field]: field === 'rememberMe' ? e.target.checked : e.target.value        [field]: field === 'rememberMe' ? e.target.checked : e.target.value

                onChange={handleInputChange('rememberMe')}

                disabled={loading}      }));      }));

              />

              Remember me    };    };

            </label>

          </div>

        )}

  const displayError = error || formError;  const displayError = error || formError;

        {displayError && (

          <div className="error-message">

            {displayError}

          </div>  return (  return (

        )}

    <div className={`auth-form login-form ${className}`}>    <div className={`auth-form login-form ${className}`}>

        <div className="form-actions">

          <button      <div className='auth-form__header'>      <div className="auth-form__header">

            type="submit"

            disabled={loading}        <h2>Sign In</h2>        <h2>Sign In</h2>

            className={`login-button ${loading ? 'loading' : ''}`}

          >        <p>Enter your credentials to access your account</p>        <p>Enter your credentials to access your account</p>

            {loading ? 'Signing in...' : 'Sign In'}

          </button>      </div>      </div>

        </div>



        <div className="form-links">

          {showForgotPassword && onForgotPassword && (      <form onSubmit={handleSubmit} className='auth-form__form'>      <form onSubmit={handleSubmit} className="auth-form__form">

            <button

              type="button"        {displayError && (        {displayError && (

              onClick={onForgotPassword}

              disabled={loading}          <div className='auth-form__error' role='alert'>          <div className="auth-form__error" role="alert">

              className="link-button"

            >            {displayError}            {displayError}

              Forgot your password?

            </button>          </div>          </div>

          )}

        )}        )}

          {showSignUp && onSignUp && (

            <div className="signup-link">

              <p>

                Don't have an account?{' '}        <div className='form-group'>        <div className="form-group">

                <button

                  type="button"          <label htmlFor='email' className='form-label'>          <label htmlFor="email" className="form-label">

                  onClick={onSignUp}

                  disabled={loading}            Email Address            Email Address

                  className="link-button"

                >          </label>          </label>

                  Sign up

                </button>          <input          <input

              </p>

            </div>            id='email'            id="email"

          )}

        </div>            type='email'            type="email"

      </form>

    </div>            value={credentials.email}            value={credentials.email}

  );

};            onChange={handleInputChange('email')}            onChange={handleInputChange('email')}



export default LoginForm;            placeholder='Enter your email'            placeholder="Enter your email"

            className='form-input'            className="form-input"

            required            required

            disabled={loading}            disabled={loading}

            autoComplete='email'            autoComplete="email"

          />          />

        </div>        </div>



        <div className='form-group'>        <div className="form-group">

          <label htmlFor='password' className='form-label'>          <label htmlFor="password" className="form-label">

            Password            Password

          </label>          </label>

          <input          <input

            id='password'            id="password"

            type='password'            type="password"

            value={credentials.password}            value={credentials.password}

            onChange={handleInputChange('password')}            onChange={handleInputChange('password')}

            placeholder='Enter your password'            placeholder="Enter your password"

            className='form-input'            className="form-input"

            required            required

            disabled={loading}            disabled={loading}

            autoComplete='current-password'            autoComplete="current-password"

          />          />

        </div>        </div>



        <div className='form-row'>        <div className="form-row">

          {showRememberMe && (          {showRememberMe && (

            <div className='form-group checkbox-group'>            <div className="form-group checkbox-group">

              <label className='checkbox-label'>              <label className="checkbox-label">

                <input                <input

                  type='checkbox'                  type="checkbox"

                  checked={credentials.rememberMe}                  checked={credentials.rememberMe}

                  onChange={handleInputChange('rememberMe')}                  onChange={handleInputChange('rememberMe')}

                  className='checkbox-input'                  className="checkbox-input"

                  disabled={loading}                  disabled={loading}

                />                />

                <span className='checkbox-text'>Remember me</span>                <span className="checkbox-text">Remember me</span>

              </label>              </label>

            </div>            </div>

          )}          )}



          {showForgotPassword && onForgotPassword && (          {showForgotPassword && onForgotPassword && (

            <button            <button

              type='button'              type="button"

              onClick={onForgotPassword}              onClick={onForgotPassword}

              className='link-button'              className="link-button"

              disabled={loading}              disabled={loading}

            >            >

              Forgot password?              Forgot password?

            </button>            </button>

          )}          )}

        </div>        </div>



        <button        <button

          type='submit'          type="submit"

          disabled={loading}          disabled={loading}

          className='auth-form__submit'          className="auth-form__submit"

        >        >

          {loading ? 'Signing in...' : 'Sign In'}          {loading ? 'Signing in...' : 'Sign In'}

        </button>        </button>

      </form>      </form>



      {showSignUp && onSignUp && (      {showSignUp && onSignUp && (

        <div className='auth-form__footer'>        <div className="auth-form__footer">

          <p>          <p>

            Don't have an account?{' '}            Don't have an account?{' '}

            <button            <button

              type='button'              type="button"

              onClick={onSignUp}              onClick={onSignUp}

              className='link-button'              className="link-button"

              disabled={loading}              disabled={loading}

            >            >

              Sign up              Sign up

            </button>            </button>

          </p>          </p>

        </div>        </div>

      )}      )}

    </div>    </div>

  );  );

};};