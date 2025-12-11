import { useState, useEffect } from 'react';
import { supabase, encryptPassword, generateSecurePassword } from '../lib/supabase';

function PasswordModal({ password, masterPassword, onClose, onSave }) {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (password) {
      setWebsite(password.website);
      setUsername(password.username);
      // Don't load password value for edit - user needs to enter it again for security
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!website || !username || !passwordValue || !masterPassword) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Encrypt the password with master password
      const encryptedPassword = encryptPassword(passwordValue, masterPassword);

      if (password) {
        // Update existing password
        const { error: updateError } = await supabase
          .from('passwords')
          .update({
            website: website.trim(),
            username: username.trim(),
            encrypted_password: encryptedPassword,
          })
          .eq('id', password.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Insert new password
        const { error: insertError } = await supabase
          .from('passwords')
          .insert({
            website: website.trim(),
            username: username.trim(),
            encrypted_password: encryptedPassword,
          });

        if (insertError) {
          throw insertError;
        }
      }

      onSave();
    } catch (err) {
      console.error('Error saving password:', err);
      setError(err.message || 'Failed to save password. Please try again.');
      setLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const generated = generateSecurePassword(16);
    setPasswordValue(generated);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{password ? 'Edit Password' : 'Add New Password'}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="website">
              Website/Service
            </label>
            <input
              id="website"
              type="text"
              className="form-input"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
              placeholder="example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username/Email
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="user@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-value">
              Password
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  id="password-value"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  required
                  style={{ width: '100%', paddingRight: '2.5rem' }}
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGeneratePassword}
              >
                Generate
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Use a strong, unique password for each account
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordModal;

