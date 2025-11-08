import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isParent } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-icon">🎓</span>
          <span>Math Tutor</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            🎮 Play
          </Link>
          <Link
            to="/progress"
            className={`navbar-link ${isActive('/progress') ? 'active' : ''}`}
          >
            📊 Progress
          </Link>
          {isParent && (
            <Link
              to="/parent"
              className={`navbar-link ${isActive('/parent') ? 'active' : ''}`}
            >
              👨‍👩‍👧‍👦 Parent
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-avatar">{user?.avatar || '🧒'}</span>
          <span className="user-name">{user?.username}</span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
