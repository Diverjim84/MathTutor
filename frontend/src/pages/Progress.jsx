import React, { useState, useEffect } from 'react';
import { progressAPI, gameAPI } from '../services/api';
import './Progress.css';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [progressRes, historyRes] = await Promise.all([
        progressAPI.getProgress(),
        gameAPI.getHistory()
      ]);

      setProgress(progressRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      setError('Failed to load progress data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your progress...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const stats = progress?.statistics || {};
  const progressData = progress?.progress || [];

  return (
    <div className="progress-page">
      <div className="container">
        <div className="progress-header fade-in">
          <h1 className="title">Your Progress</h1>
          <p className="subtitle">Track your math learning journey</p>
        </div>

        {/* Overall Statistics */}
        <div className="card fade-in">
          <h2 className="section-title">Overall Statistics</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">📚</div>
              <div className="stat-number">{stats.skills_practiced || 0}</div>
              <div className="stat-label">Skills Practiced</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">✍️</div>
              <div className="stat-number">{stats.total_problems_attempted || 0}</div>
              <div className="stat-label">Problems Attempted</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">✅</div>
              <div className="stat-number">{stats.total_problems_correct || 0}</div>
              <div className="stat-label">Problems Correct</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🎯</div>
              <div className="stat-number">{stats.overall_accuracy || 0}%</div>
              <div className="stat-label">Overall Accuracy</div>
            </div>
          </div>
        </div>

        {/* Skills Progress */}
        {progressData.length > 0 && (
          <div className="card fade-in">
            <h2 className="section-title">Skills Progress</h2>
            <div className="skills-list">
              {progressData.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-header">
                    <div className="skill-name">
                      {skill.skill_type.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div className="skill-accuracy">
                      <span className={`badge ${
                        skill.accuracy >= 80 ? 'badge-success' :
                        skill.accuracy >= 60 ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {skill.accuracy}% accuracy
                      </span>
                    </div>
                  </div>
                  <div className="skill-stats">
                    <span>
                      {skill.successful_attempts} / {skill.total_attempts} correct
                    </span>
                    <span>
                      Last practiced: {new Date(skill.last_practiced).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${skill.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Games */}
        {history.length > 0 && (
          <div className="card fade-in">
            <h2 className="section-title">Recent Games</h2>
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Game Type</th>
                    <th>Difficulty</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 10).map((game) => (
                    <tr key={game.id}>
                      <td>{new Date(game.completed_at).toLocaleDateString()}</td>
                      <td>{game.game_type.replace(/_/g, ' ')}</td>
                      <td>
                        <span className="badge badge-info">{game.difficulty}</span>
                      </td>
                      <td>
                        {game.score} / {game.total_questions}
                      </td>
                      <td>
                        {Math.round((game.correct_answers / game.total_questions) * 100)}%
                      </td>
                      <td>{Math.round(game.time_taken / 1000)}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {history.length === 0 && progressData.length === 0 && (
          <div className="card empty-state fade-in">
            <div className="empty-icon">📊</div>
            <h3>No Progress Yet</h3>
            <p>Start playing games to see your progress here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
