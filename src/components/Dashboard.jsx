import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PasswordList from './PasswordList';
import PasswordModal from './PasswordModal';

function Dashboard({ user, session, onLogout }) {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [masterPassword, setMasterPassword] = useState('');
  const [showMasterPasswordPrompt, setShowMasterPasswordPrompt] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      fetchPasswords();
    }
  }, [session]);

  const fetchPasswords = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('passwords')
        .select('id, website, username, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setPasswords(data || []);
    } catch (err) {
      console.error('Error fetching passwords:', err);
      setError('Failed to load passwords. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPassword = () => {
    if (!masterPassword) {
      setShowMasterPasswordPrompt(true);
      return;
    }
    setEditingPassword(null);
    setShowModal(true);
  };

  const handleEditPassword = (password) => {
    if (!masterPassword) {
      setShowMasterPasswordPrompt(true);
      return;
    }
    setEditingPassword(password);
    setShowModal(true);
  };

  const handleMasterPasswordSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get('masterPassword');
    setMasterPassword(password);
    setShowMasterPasswordPrompt(false);
    if (editingPassword) {
      setShowModal(true);
    }
  };

  const handlePasswordSaved = () => {
    fetchPasswords();
    setShowModal(false);
    setEditingPassword(null);
  };

  const handleDeletePassword = async (id) => {
    if (!window.confirm('Are you sure you want to delete this password?')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('passwords')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      fetchPasswords();
    } catch (err) {
      console.error('Error deleting password:', err);
      alert('Failed to delete password. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-header-content">
            <h1>PassKeep</h1>
            <div className="user-info">
              <span>{user.email}</span>
              <button className="btn btn-secondary" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="passwords-header">
          <h2>Your Passwords</h2>
          <button className="btn btn-primary" onClick={handleAddPassword}>
            Add Password
          </button>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <PasswordList
            passwords={passwords}
            onEdit={handleEditPassword}
            onDelete={handleDeletePassword}
            masterPassword={masterPassword}
          />
        )}
      </div>

      {showMasterPasswordPrompt && (
        <div className="modal-overlay" onClick={() => setShowMasterPasswordPrompt(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleMasterPasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Enter Master Password</label>
                <input
                  type="password"
                  name="masterPassword"
                  className="form-input"
                  required
                  autoFocus
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  This is used to encrypt/decrypt your passwords
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <PasswordModal
          password={editingPassword}
          masterPassword={masterPassword}
          onClose={() => {
            setShowModal(false);
            setEditingPassword(null);
          }}
          onSave={handlePasswordSaved}
        />
      )}
    </div>
  );
}

export default Dashboard;

