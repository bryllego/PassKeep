import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser({
          id: session.user.id,
          email: session.user.email,
        });
        setIsAuthenticated(true);
      }
      setLoading(false);
    });

    // Listen for auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser({
          id: session.user.id,
          email: session.user.email,
        });
        setIsAuthenticated(true);
      } else {
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData, authSession) => {
    setSession(authSession);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="card">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard user={user} session={session} onLogout={handleLogout} />;
  }

  return (
    <div className="app">
      {showRegister ? (
        <Register onLogin={handleLogin} onSwitchToLogin={() => setShowRegister(false)} />
      ) : (
        <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
      )}
    </div>
  );
}

export default App;

