import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const AVATARS = ['🧒', '👦', '👧', '🧑', '👨', '👩', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🐱', '🐶'];

const Login = () => {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    gradeLevel: 0,
    avatar: '🧒'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await register(
          formData.username,
          formData.password,
          formData.gradeLevel,
          formData.avatar
        );
      } else {
        await login(formData.username, formData.password);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-page">
      <div className="login-container fade-in">
        <div className="login-header">
          <h1 className="login-title">🎓 Math Tutor Game</h1>
          <p className="login-subtitle">
            {isRegistering ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {isRegistering && (
            <>
              <div className="form-group">
                <label htmlFor="gradeLevel">Grade Level</label>
                <select
                  id="gradeLevel"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="K">Kindergarten</option>
                  <option value="1">1st Grade</option>
                  <option value="2">2nd Grade</option>
                  <option value="3">3rd Grade</option>
                  <option value="4">4th Grade</option>
                  <option value="5">5th Grade</option>
                </select>
              </div>

              <div className="form-group">
                <label>Choose Your Avatar</label>
                <div className="avatar-selector">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      className={`avatar-option ${
                        formData.avatar === avatar ? 'selected' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, avatar })}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Loading...' : isRegistering ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
          >
            {isRegistering
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </button>
        </div>

        <div className="default-account-info">
          <p>
            <strong>Default Parent Account:</strong>
          </p>
          <p>Username: parent | Password: parent123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
