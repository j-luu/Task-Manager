import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = ({ onSignupSuccess, switchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users', {
        username,
        password,
      });

      setSuccessMsg('Account created! You can now log in.');
      setUsername('');
      setPassword('');
      setError('');
      onSignupSuccess(username); 
    } catch (err) {
      console.error(err);
      setError('Signup failed. Username may already exist.');
      setSuccessMsg('');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '15px' }}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            Sign Up
          </button>
        </form>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {successMsg && <p style={{ color: '#008000', textAlign: 'center' }}>{successMsg}</p>}
        <button
          onClick={switchToLogin}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Already have an account? Log in
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
