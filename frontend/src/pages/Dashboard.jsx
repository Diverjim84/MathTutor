import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import './Dashboard.css';

const SPECIAL_MODES = [
  {
    id: 'times_tables',
    name: 'Times Tables',
    description: 'Master multiplication tables 1-12',
    icon: '✖️',
    color: '#10b981'
  },
  {
    id: 'tens_reciprocals',
    name: 'Tens Reciprocals',
    description: 'Practice pairs that add to 10',
    icon: '🔟',
    color: '#f59e0b'
  }
];

const GRADES = [
  { id: 'K', name: 'Kindergarten', icon: '🌱', skills: 'Counting, Addition/Subtraction to 5' },
  { id: '1', name: '1st Grade', icon: '🌿', skills: 'Addition/Subtraction to 20, Tens Reciprocals' },
  { id: '2', name: '2nd Grade', icon: '🌳', skills: 'Addition/Subtraction to 100, Times Tables 2,5,10' },
  { id: '3', name: '3rd Grade', icon: '🎄', skills: 'Multiplication & Division, All Times Tables' },
  { id: '4', name: '4th Grade', icon: '🌲', skills: 'Multi-digit Operations, Fractions' },
  { id: '5', name: '5th Grade', icon: '🏔️', skills: 'Decimals, Percentages, Advanced Fractions' }
];

const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', icon: '🐢', description: 'Timmy the Turtle' },
  { id: 'medium', name: 'Medium', icon: '🐰', description: 'Rosie the Rabbit' },
  { id: 'hard', name: 'Hard', icon: '🐆', description: 'Charlie the Cheetah' },
  { id: 'expert', name: 'Expert', icon: '🦉', description: 'Einstein the Owl' }
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [raceMode, setRaceMode] = useState(true);
  const [questionsCount, setQuestionsCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startGame = async (gameType, gradeLevel) => {
    setLoading(true);
    setError('');

    try {
      const response = await gameAPI.startGame({
        gameType,
        difficulty,
        gradeLevel,
        questionsCount,
        raceMode
      });

      navigate('/game', { state: { session: response.data } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start game');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header fade-in">
          <h1 className="title">
            Welcome back, {user?.username}! {user?.avatar}
          </h1>
          <p className="subtitle">Choose a game to start practicing math</p>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Game Settings */}
        <div className="card fade-in">
          <h2 className="section-title">Game Settings</h2>

          <div className="settings-grid">
            <div className="setting-group">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={raceMode}
                  onChange={(e) => setRaceMode(e.target.checked)}
                />
                <span>Race Mode (compete against AI)</span>
              </label>
            </div>

            {raceMode && (
              <div className="setting-group">
                <label>AI Difficulty</label>
                <div className="difficulty-selector">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.id}
                      className={`difficulty-option ${
                        difficulty === diff.id ? 'selected' : ''
                      }`}
                      onClick={() => setDifficulty(diff.id)}
                    >
                      <div className="difficulty-icon">{diff.icon}</div>
                      <div className="difficulty-name">{diff.name}</div>
                      <div className="difficulty-desc">{diff.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="setting-group">
              <label>Number of Questions</label>
              <select
                value={questionsCount}
                onChange={(e) => setQuestionsCount(Number(e.target.value))}
                className="input"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Special Game Modes */}
        <div className="card fade-in">
          <h2 className="section-title">Special Practice Modes</h2>
          <div className="game-grid">
            {SPECIAL_MODES.map((mode) => (
              <div
                key={mode.id}
                className="game-card"
                style={{ borderColor: mode.color }}
                onClick={() => !loading && startGame(mode.id)}
              >
                <div className="game-icon" style={{ color: mode.color }}>
                  {mode.icon}
                </div>
                <h3 className="game-name">{mode.name}</h3>
                <p className="game-description">{mode.description}</p>
                <button
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ background: mode.color }}
                >
                  {loading ? 'Starting...' : 'Play Now'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Level Games */}
        <div className="card fade-in">
          <h2 className="section-title">Practice by Grade Level</h2>
          <div className="grade-grid">
            {GRADES.map((grade) => (
              <div
                key={grade.id}
                className={`grade-card ${
                  user.gradeLevel === grade.id ? 'current-grade' : ''
                }`}
                onClick={() => !loading && startGame('grade_level', grade.id)}
              >
                <div className="grade-icon">{grade.icon}</div>
                <h3 className="grade-name">{grade.name}</h3>
                {user.gradeLevel === grade.id && (
                  <span className="badge badge-info">Your Grade</span>
                )}
                <p className="grade-skills">{grade.skills}</p>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? 'Starting...' : 'Practice'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
