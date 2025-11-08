const express = require('express');
const { getDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's progress summary
router.get('/', (req, res) => {
  const db = getDB();

  db.all(
    `SELECT
      skill_type,
      skill_level,
      mastery_level,
      total_attempts,
      successful_attempts,
      ROUND(CAST(successful_attempts AS FLOAT) / CAST(total_attempts AS FLOAT) * 100, 1) as accuracy,
      last_practiced
    FROM progress
    WHERE user_id = ?
    ORDER BY last_practiced DESC`,
    [req.user.id],
    (err, progress) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Calculate overall statistics
      db.get(
        `SELECT
          COUNT(DISTINCT skill_type || skill_level) as skills_practiced,
          SUM(total_attempts) as total_problems_attempted,
          SUM(successful_attempts) as total_problems_correct,
          ROUND(AVG(CAST(successful_attempts AS FLOAT) / CAST(total_attempts AS FLOAT) * 100), 1) as overall_accuracy
        FROM progress
        WHERE user_id = ?`,
        [req.user.id],
        (err, stats) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          res.json({
            progress,
            statistics: stats || {
              skills_practiced: 0,
              total_problems_attempted: 0,
              total_problems_correct: 0,
              overall_accuracy: 0
            }
          });
        }
      );
    }
  );
});

// Get progress for a specific skill
router.get('/:skillType/:skillLevel', (req, res) => {
  const { skillType, skillLevel } = req.params;
  const db = getDB();

  db.get(
    `SELECT * FROM progress WHERE user_id = ? AND skill_type = ? AND skill_level = ?`,
    [req.user.id, skillType, skillLevel],
    (err, progress) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!progress) {
        return res.json({
          skillType,
          skillLevel,
          mastery_level: 0,
          total_attempts: 0,
          successful_attempts: 0,
          accuracy: 0,
          never_practiced: true
        });
      }

      res.json({
        ...progress,
        accuracy: progress.total_attempts > 0
          ? Math.round((progress.successful_attempts / progress.total_attempts) * 100 * 10) / 10
          : 0
      });
    }
  );
});

// Get user's achievements
router.get('/achievements', (req, res) => {
  const db = getDB();

  db.all(
    `SELECT achievement_type, earned_at FROM achievements WHERE user_id = ? ORDER BY earned_at DESC`,
    [req.user.id],
    (err, achievements) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(achievements);
    }
  );
});

// Get leaderboard (top scores across all users)
router.get('/leaderboard/:gameType', (req, res) => {
  const { gameType } = req.params;
  const db = getDB();

  db.all(
    `SELECT
      u.username,
      u.avatar,
      u.grade_level,
      MAX(gs.score) as best_score,
      AVG(gs.score) as avg_score,
      COUNT(*) as games_played
    FROM game_sessions gs
    JOIN users u ON gs.user_id = u.id
    WHERE gs.game_type = ? AND u.is_parent = 0
    GROUP BY gs.user_id
    ORDER BY best_score DESC, avg_score DESC
    LIMIT 10`,
    [gameType],
    (err, leaderboard) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(leaderboard);
    }
  );
});

module.exports = router;
