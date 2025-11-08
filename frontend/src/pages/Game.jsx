import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gameAPI } from '../services/api';
import './Game.css';

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(location.state?.session);
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [aiAnswering, setAiAnswering] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
    setStartTime(Date.now());
  }, [session, navigate]);

  useEffect(() => {
    // Simulate AI answering if in race mode
    if (session?.raceMode && !showResult && !gameComplete) {
      const aiOpponent = session.aiOpponent;
      if (aiOpponent) {
        // Random delay based on AI difficulty
        const minTime = parseInt(aiOpponent.speed.split('-')[0]) * 1000;
        const maxTime = parseInt(aiOpponent.speed.split('-')[1]) * 1000;
        const aiTime = Math.random() * (maxTime - minTime) + minTime;

        const timer = setTimeout(() => {
          setAiAnswering(true);
        }, aiTime);

        return () => clearTimeout(timer);
      }
    }
  }, [session, showResult, gameComplete]);

  const submitAnswer = async () => {
    if (!userAnswer.trim() || loading) return;

    setLoading(true);
    const timeTaken = Date.now() - startTime;

    try {
      const response = await gameAPI.submitAnswer({
        sessionId: session.sessionId,
        answer: parseFloat(userAnswer),
        timeTaken
      });

      setLastResult({
        isCorrect: response.data.isCorrect,
        correctAnswer: response.data.correctAnswer
      });

      if (response.data.aiResult) {
        setAiResult(response.data.aiResult);
      }

      setShowResult(true);

      if (response.data.gameComplete) {
        setGameComplete(true);
        setFinalResults(response.data);
      } else {
        // Update session with next question
        setTimeout(() => {
          setSession({
            ...session,
            currentQuestion: response.data.nextQuestion,
            questionNumber: response.data.questionNumber,
            currentScore: response.data.currentScore,
            aiScore: response.data.aiScore
          });
          setUserAnswer('');
          setShowResult(false);
          setLastResult(null);
          setAiResult(null);
          setAiAnswering(false);
          setStartTime(Date.now());
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showResult) {
      submitAnswer();
    }
  };

  const playAgain = () => {
    navigate('/');
  };

  if (!session) {
    return null;
  }

  if (gameComplete && finalResults) {
    const playerWon = finalResults.winner === 'player';
    const isTie = finalResults.winner === 'tie';

    return (
      <div className="game-complete">
        <div className="container">
          <div className="card results-card fade-in">
            <div className="results-header">
              {session.raceMode && (
                <div className={`winner-badge ${playerWon ? 'winner' : isTie ? 'tie' : 'loser'}`}>
                  {playerWon ? '🏆 You Won!' : isTie ? '🤝 Tie Game!' : '😅 AI Won!'}
                </div>
              )}
              <h1 className="results-title">Game Complete!</h1>
            </div>

            <div className="results-stats">
              <div className="stat-card">
                <div className="stat-label">Your Score</div>
                <div className="stat-value">
                  {finalResults.userScore} / {finalResults.totalQuestions}
                </div>
                <div className="stat-percentage">
                  {Math.round((finalResults.userScore / finalResults.totalQuestions) * 100)}%
                </div>
              </div>

              {session.raceMode && (
                <div className="stat-card">
                  <div className="stat-label">
                    AI Score ({session.aiOpponent?.avatar} {session.aiOpponent?.name})
                  </div>
                  <div className="stat-value">
                    {finalResults.aiScore} / {finalResults.totalQuestions}
                  </div>
                  <div className="stat-percentage">
                    {Math.round((finalResults.aiScore / finalResults.totalQuestions) * 100)}%
                  </div>
                </div>
              )}

              <div className="stat-card">
                <div className="stat-label">Time Taken</div>
                <div className="stat-value">
                  {Math.round(finalResults.totalTime / 1000)}s
                </div>
              </div>
            </div>

            <div className="results-actions">
              <button className="btn btn-primary" onClick={playAgain}>
                Play Again
              </button>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/progress')}
              >
                View Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="container">
        {/* Score Display */}
        <div className="score-bar fade-in">
          <div className="score-section">
            <span className="score-label">Question</span>
            <span className="score-value">
              {session.questionNumber} / {session.totalQuestions}
            </span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(session.questionNumber / session.totalQuestions) * 100}%`
              }}
            />
          </div>

          <div className="score-section">
            <span className="score-label">Your Score</span>
            <span className="score-value player-score">
              {session.currentScore || 0}
            </span>
          </div>

          {session.raceMode && (
            <div className="score-section ai-section">
              <span className="score-label">
                {session.aiOpponent?.avatar} AI Score
              </span>
              <span className="score-value ai-score">{session.aiScore || 0}</span>
            </div>
          )}
        </div>

        {/* Question Card */}
        <div className="card question-card fade-in">
          <div className="question-text">{session.currentQuestion?.question}</div>

          {session.currentQuestion?.hint && (
            <div className="hint">💡 {session.currentQuestion.hint}</div>
          )}

          <div className="answer-section">
            <input
              type="number"
              step="any"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              className="answer-input"
              placeholder="Your answer..."
              disabled={showResult || loading}
              autoFocus
            />
            <button
              className="btn btn-primary submit-btn"
              onClick={submitAnswer}
              disabled={!userAnswer.trim() || showResult || loading}
            >
              {loading ? 'Checking...' : 'Submit'}
            </button>
          </div>

          {/* AI Status */}
          {session.raceMode && !showResult && (
            <div className={`ai-status ${aiAnswering ? 'ai-answering' : ''}`}>
              {aiAnswering ? (
                <span className="bounce">
                  {session.aiOpponent?.avatar} AI is answering...
                </span>
              ) : (
                <span>
                  {session.aiOpponent?.avatar} AI is thinking...
                </span>
              )}
            </div>
          )}

          {/* Result Display */}
          {showResult && lastResult && (
            <div className={`result-display ${lastResult.isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="result-icon">
                {lastResult.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              {!lastResult.isCorrect && (
                <div className="correct-answer">
                  The correct answer was: {lastResult.correctAnswer}
                </div>
              )}
              {aiResult && (
                <div className="ai-result">
                  {session.aiOpponent?.avatar} AI answered: {aiResult.answer}{' '}
                  {aiResult.isCorrect ? '✅' : '❌'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="tips-card fade-in">
          <p>💡 Tip: Press Enter to submit your answer quickly!</p>
        </div>
      </div>
    </div>
  );
};

export default Game;
