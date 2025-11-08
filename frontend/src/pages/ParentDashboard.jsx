import React, { useState, useEffect } from 'react';
import { parentAPI } from '../services/api';
import './ParentDashboard.css';

const ParentDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [usersRes, activityRes] = await Promise.all([
        parentAPI.getUsers(),
        parentAPI.getActivity()
      ]);

      setUsers(usersRes.data);
      setActivity(activityRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async (userId) => {
    try {
      const response = await parentAPI.getUserStats(userId);
      setUserStats(response.data);
      setSelectedUser(userId);
    } catch (err) {
      console.error('Failed to load user stats:', err);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user and all their data?')) {
      return;
    }

    try {
      await parentAPI.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      if (selectedUser === userId) {
        setSelectedUser(null);
        setUserStats(null);
      }
    } catch (err) {
      alert('Failed to delete user');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="parent-dashboard">
      <div className="container">
        <div className="dashboard-header fade-in">
          <h1 className="title">👨‍👩‍👧‍👦 Parent Dashboard</h1>
          <p className="subtitle">Monitor your children's math progress</p>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Users Overview */}
        <div className="card fade-in">
          <h2 className="section-title">Children ({users.length})</h2>
          <div className="users-grid">
            {users.map((user) => (
              <div
                key={user.id}
                className={`user-card ${selectedUser === user.id ? 'selected' : ''}`}
                onClick={() => loadUserStats(user.id)}
              >
                <div className="user-avatar">{user.avatar}</div>
                <div className="user-name">{user.username}</div>
                <div className="user-grade">
                  Grade: {user.gradeLevel === 'K' ? 'K' : `${user.gradeLevel}`}
                </div>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteUser(user.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected User Stats */}
        {selectedUser && userStats && (
          <div className="card fade-in">
            <h2 className="section-title">
              Statistics for {users.find((u) => u.id === selectedUser)?.username}
            </h2>

            {userStats.gameStats.length > 0 ? (
              <>
                <div className="stats-grid">
                  {userStats.gameStats.map((stat, index) => (
                    <div key={index} className="stat-card">
                      <div className="stat-label">
                        {stat.game_type.replace(/_/g, ' ').toUpperCase()}
                      </div>
                      <div className="stat-row">
                        <span>Games Played:</span>
                        <span>{stat.total_games}</span>
                      </div>
                      <div className="stat-row">
                        <span>Best Score:</span>
                        <span>{stat.best_score}</span>
                      </div>
                      <div className="stat-row">
                        <span>Average Score:</span>
                        <span>{Math.round(stat.avg_score)}</span>
                      </div>
                      <div className="stat-row">
                        <span>Success Rate:</span>
                        <span>
                          {Math.round((stat.total_correct / stat.total_questions) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {userStats.progress.length > 0 && (
                  <div className="progress-section">
                    <h3>Skills Progress</h3>
                    <div className="skills-list">
                      {userStats.progress.map((skill, index) => (
                        <div key={index} className="skill-row">
                          <div className="skill-info">
                            <span className="skill-name">
                              {skill.skill_type.replace(/_/g, ' ')}
                            </span>
                            <span className="skill-attempts">
                              {skill.successful_attempts} / {skill.total_attempts} correct
                            </span>
                          </div>
                          <div className="skill-progress">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${(skill.successful_attempts / skill.total_attempts) * 100}%`
                                }}
                              />
                            </div>
                            <span className="skill-percentage">
                              {Math.round((skill.successful_attempts / skill.total_attempts) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <p>No statistics available yet for this user.</p>
              </div>
            )}
          </div>
        )}

        {/* Recent Activity */}
        {activity.length > 0 && (
          <div className="card fade-in">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {activity.slice(0, 20).map((item) => (
                <div key={item.id} className="activity-item">
                  <div className="activity-avatar">{item.avatar}</div>
                  <div className="activity-content">
                    <div className="activity-user">{item.username}</div>
                    <div className="activity-details">
                      Played {item.game_type.replace(/_/g, ' ')} - Score: {item.score} /{' '}
                      {item.total_questions}
                    </div>
                  </div>
                  <div className="activity-time">
                    {new Date(item.completed_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {users.length === 0 && (
          <div className="card empty-state fade-in">
            <div className="empty-icon">👨‍👩‍👧‍👦</div>
            <h3>No Children Accounts Yet</h3>
            <p>Create child accounts from the login page to start tracking progress.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
