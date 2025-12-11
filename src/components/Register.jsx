import { useState } from 'react';
import { supabase, validatePasswordStrength } from '../lib/supabase';

function Register({ onLogin, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, errors: [] });

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value) {
      const validation = validatePasswordStrength(value);
      setPasswordStrength(validation);
    } else {
      setPasswordStrength({ isValid: false, errors: [] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password strength validation
    const validation = validatePasswordStrength(password);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setLoading(true);

    try {
      // Sign up with Supabase Auth (includes built-in security features)
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          // Security: Require email confirmation (recommended for production)
          emailRedirectTo: `${window.location.origin}/`,
          // Security: Don't send confirmation email in development
          // In production, enable email confirmation in Supabase dashboard
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else if (authError.message.includes('Password')) {
          setError('Password does not meet security requirements');
        } else if (authError.message.includes('rate limit')) {
          setError('Too many registration attempts. Please try again later.');
        } else {
          setError(authError.message || 'Registration failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      if (data.user && data.session) {
        // Successfully registered and signed in
        onLogin({
          id: data.user.id,
          email: data.user.email,
        }, data.session);
      } else if (data.user && !data.session) {
        // Email confirmation required
        setError('Registration successful! Please check your email to confirm your account before signing in.');
        setLoading(false);
      } else {
        setError('Registration failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <div className="auth-header">
          <h1>PassKeep</h1>
          <p>Create your secure account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                autoComplete="new-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  fontSize: '0.875rem',
                }}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Must be at least 12 characters with uppercase, lowercase, number, and special character
              </div>
              {password && passwordStrength.errors.length > 0 && (
                <div style={{ color: 'var(--error-color)' }}>
                  {passwordStrength.errors.map((err, idx) => (
                    <div key={idx}>• {err}</div>
                  ))}
                </div>
              )}
              {password && passwordStrength.isValid && (
                <div style={{ color: 'var(--success-color)' }}>✓ Password strength: Strong</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  fontSize: '0.875rem',
                }}
                tabIndex={-1}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <div style={{ fontSize: '0.75rem', color: 'var(--error-color)', marginTop: '0.25rem' }}>
                Passwords do not match
              </div>
            )}
            {confirmPassword && password === confirmPassword && passwordStrength.isValid && (
              <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', marginTop: '0.25rem' }}>
                ✓ Passwords match
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="switch-link">
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;

