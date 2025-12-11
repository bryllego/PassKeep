import { useState } from 'react';
import { supabase, decryptPassword } from '../lib/supabase';

function PasswordList({ passwords, onEdit, onDelete, masterPassword }) {
  const [viewingPassword, setViewingPassword] = useState(null);
  const [decryptedPassword, setDecryptedPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleViewPassword = async (id) => {
    if (!masterPassword) {
      alert('Please set your master password first');
      return;
    }

    try {
      setLoading(true);
      
      // Fetch the encrypted password from Supabase
      const { data, error: fetchError } = await supabase
        .from('passwords')
        .select('encrypted_password')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!data || !data.encrypted_password) {
        throw new Error('Password not found');
      }

      // Decrypt the password using master password
      const decrypted = decryptPassword(data.encrypted_password, masterPassword);
      
      setViewingPassword(id);
      setDecryptedPassword(decrypted);
    } catch (err) {
      console.error('Error viewing password:', err);
      if (err.message.includes('Invalid master password')) {
        alert('Invalid master password. Please try again.');
      } else {
        alert('Failed to decrypt password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (passwords.length === 0) {
    return (
      <div className="empty-state">
        <h3>No passwords stored yet</h3>
        <p>Click "Add Password" to get started</p>
      </div>
    );
  }

  return (
    <div className="passwords-list">
      {passwords.map((password) => (
        <div key={password.id} className="password-item">
          <div className="password-info">
            <h3>{password.website}</h3>
            <p>Username: {password.username}</p>
            {viewingPassword === password.id && (
              <div className="password-display">
                Password: {decryptedPassword}
              </div>
            )}
          </div>
          <div className="password-actions">
            {viewingPassword === password.id ? (
              <button
                className="btn btn-secondary btn-small"
                onClick={() => {
                  setViewingPassword(null);
                  setDecryptedPassword('');
                }}
                disabled={loading}
              >
                Hide
              </button>
            ) : (
              <button
                className="btn btn-secondary btn-small"
                onClick={() => handleViewPassword(password.id)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View'}
              </button>
            )}
            <button
              className="btn btn-primary btn-small"
              onClick={() => onEdit(password)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-small"
              onClick={() => onDelete(password.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PasswordList;

