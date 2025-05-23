import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MyTodos from './components/MyTodos';

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginOrSignup = (name) => {
    setUsername(name);
    localStorage.setItem('username', name);
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem('username');
  };

  if (username) {
    return <MyTodos username={username} onLogout={handleLogout} />;
  }

  return (
    <div>
      {showSignup ? (
        <SignupPage
          onSignupSuccess={handleLoginOrSignup}
          switchToLogin={() => setShowSignup(false)}
        />
      ) : (
        <LoginPage
          onLoginSuccess={handleLoginOrSignup}
          switchToSignup={() => setShowSignup(true)}
        />
      )}
    </div>
  );
}

export default App;
