const express = require('express');
const { getDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const { generateQuestion, checkAnswer, getSkillsForGrade } = require('../curriculum');
const AIOpponent = require('../aiOpponent');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Active game sessions (in-memory for simplicity)
const activeSessions = new Map();

// Get available game types and curriculum
router.get('/curriculum', (req, res) => {
  const { gradeLevel } = req.query;

  if (gradeLevel) {
    const skills = getSkillsForGrade(gradeLevel);
    if (!skills) {
      return res.status(404).json({ error: 'Grade level not found' });
    }
    res.json(skills);
  } else {
    // Return all available grades
    const grades = ['K', '1', '2', '3', '4', '5'];
    res.json({
      grades,
      specialModes: [
        { id: 'times_tables', name: 'Times Tables Practice', description: 'Practice multiplication tables 1-12' },
        { id: 'tens_reciprocals', name: 'Tens Reciprocals', description: 'Practice number pairs that add to 10' }
      ]
    });
  }
});

// Start a new game session
router.post('/start', (req, res) => {
  const { gameType, difficulty, gradeLevel, skillId, questionsCount, raceMode } = req.body;

  if (!gameType) {
    return res.status(400).json({ error: 'Game type required' });
  }

  const sessionId = `${req.user.id}-${Date.now()}`;
  const questions = [];
  const count = questionsCount || 10;

  // Generate questions
  try {
    for (let i = 0; i < count; i++) {
      const q = generateQuestion(gameType, gradeLevel, skillId);
      questions.push({
        id: i,
        question: q.question,
        answer: q.answer,
        type: q.type,
        precision: q.precision,
        hint: q.hint
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  // Setup AI opponent if race mode
  let aiOpponent = null;
  if (raceMode) {
    aiOpponent = new AIOpponent(difficulty || 'medium');
  }

  const session = {
    sessionId,
    userId: req.user.id,
    gameType,
    difficulty: difficulty || 'medium',
    gradeLevel,
    skillId,
    questions,
    currentQuestionIndex: 0,
    userScore: 0,
    aiScore: 0,
    userAnswers: [],
    aiAnswers: [],
    startTime: Date.now(),
    raceMode: !!raceMode,
    aiOpponent: aiOpponent ? aiOpponent.getInfo() : null
  };

  activeSessions.set(sessionId, { session, aiOpponent });

  res.json({
    sessionId,
    totalQuestions: questions.length,
    currentQuestion: questions[0],
    questionNumber: 1,
    raceMode: !!raceMode,
    aiOpponent: aiOpponent ? aiOpponent.getInfo() : null
  });
});

// Submit an answer
router.post('/answer', (req, res) => {
  const { sessionId, answer, timeTaken } = req.body;

  if (!sessionId || answer === undefined) {
    return res.status(400).json({ error: 'Session ID and answer required' });
  }

  const sessionData = activeSessions.get(sessionId);
  if (!sessionData) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { session, aiOpponent } = sessionData;
  const currentQuestion = session.questions[session.currentQuestionIndex];

  // Check user's answer
  const isCorrect = checkAnswer(answer, currentQuestion.answer, currentQuestion.precision || 0);

  if (isCorrect) {
    session.userScore++;
  }

  session.userAnswers.push({
    questionId: currentQuestion.id,
    userAnswer: answer,
    correctAnswer: currentQuestion.answer,
    isCorrect,
    timeTaken
  });

  // Simulate AI answer if in race mode
  let aiResult = null;
  if (session.raceMode && aiOpponent) {
    aiResult = aiOpponent.simulateAnswer(currentQuestion.answer);
    if (aiResult.isCorrect) {
      session.aiScore++;
    }
    session.aiAnswers.push({
      questionId: currentQuestion.id,
      aiAnswer: aiResult.answer,
      correctAnswer: currentQuestion.answer,
      isCorrect: aiResult.isCorrect,
      timeTaken: aiResult.responseTime
    });
  }

  // Move to next question
  session.currentQuestionIndex++;

  // Check if game is complete
  if (session.currentQuestionIndex >= session.questions.length) {
    const gameComplete = true;
    const endTime = Date.now();
    const totalTime = endTime - session.startTime;

    // Save to database
    const db = getDB();
    db.run(
      `INSERT INTO game_sessions (user_id, game_type, difficulty, grade_level, score, total_questions, correct_answers, time_taken)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.userId,
        session.gameType,
        session.difficulty,
        session.gradeLevel,
        session.userScore,
        session.questions.length,
        session.userScore,
        totalTime
      ]
    );

    // Update progress
    if (session.skillId) {
      db.run(
        `INSERT INTO progress (user_id, skill_type, skill_level, total_attempts, successful_attempts)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(user_id, skill_type, skill_level)
         DO UPDATE SET
           total_attempts = total_attempts + ?,
           successful_attempts = successful_attempts + ?,
           last_practiced = CURRENT_TIMESTAMP`,
        [
          session.userId,
          session.gameType,
          session.skillId,
          session.questions.length,
          session.userScore,
          session.questions.length,
          session.userScore
        ]
      );
    }

    // Clean up session
    activeSessions.delete(sessionId);

    return res.json({
      gameComplete,
      isCorrect,
      correctAnswer: currentQuestion.answer,
      userScore: session.userScore,
      aiScore: session.aiScore,
      totalQuestions: session.questions.length,
      totalTime,
      aiResult,
      winner: session.raceMode
        ? session.userScore > session.aiScore
          ? 'player'
          : session.userScore < session.aiScore
          ? 'ai'
          : 'tie'
        : null
    });
  }

  // Return next question
  const nextQuestion = session.questions[session.currentQuestionIndex];
  res.json({
    gameComplete: false,
    isCorrect,
    correctAnswer: currentQuestion.answer,
    currentScore: session.userScore,
    aiScore: session.aiScore,
    questionNumber: session.currentQuestionIndex + 1,
    totalQuestions: session.questions.length,
    nextQuestion,
    aiResult
  });
});

// Get current session status
router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const sessionData = activeSessions.get(sessionId);

  if (!sessionData) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { session } = sessionData;
  res.json({
    sessionId,
    currentQuestionIndex: session.currentQuestionIndex,
    totalQuestions: session.questions.length,
    userScore: session.userScore,
    aiScore: session.aiScore,
    raceMode: session.raceMode
  });
});

// Get user's game history
router.get('/history', (req, res) => {
  const db = getDB();
  db.all(
    `SELECT * FROM game_sessions WHERE user_id = ? ORDER BY completed_at DESC LIMIT 50`,
    [req.user.id],
    (err, sessions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(sessions);
    }
  );
});

module.exports = router;
