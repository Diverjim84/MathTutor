const express = require('express');
const { getDB } = require('../database');
const { authenticateToken, requireParent } = require('../middleware/auth');

const router = express.Router();

// All routes require parent authentication
router.use(authenticateToken);
router.use(requireParent);

// Get all child users
router.get('/users', (req, res) => {
  const db = getDB();
  db.all(
    'SELECT id, username, grade_level, avatar, created_at FROM users WHERE is_parent = 0 ORDER BY created_at DESC',
    [],
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(users.map(u => ({
        id: u.id,
        username: u.username,
        gradeLevel: u.grade_level,
        avatar: u.avatar,
        createdAt: u.created_at
      })));
    }
  );
});

// Get statistics for a specific child
router.get('/users/:userId/stats', (req, res) => {
  const { userId } = req.params;
  const db = getDB();

  db.all(
    `SELECT
      game_type,
      COUNT(*) as total_games,
      AVG(score) as avg_score,
      SUM(correct_answers) as total_correct,
      SUM(total_questions) as total_questions,
      MAX(score) as best_score
    FROM game_sessions
    WHERE user_id = ?
    GROUP BY game_type`,
    [userId],
    (err, gameStats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      db.all(
        `SELECT skill_type, skill_level, mastery_level, total_attempts, successful_attempts, last_practiced
        FROM progress
        WHERE user_id = ?
        ORDER BY last_practiced DESC`,
        [userId],
        (err, progress) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          res.json({
            gameStats,
            progress
          });
        }
      );
    }
  );
});

// Get all recent activity
router.get('/activity', (req, res) => {
  const db = getDB();
  db.all(
    `SELECT
      gs.id,
      gs.user_id,
      u.username,
      u.avatar,
      gs.game_type,
      gs.score,
      gs.correct_answers,
      gs.total_questions,
      gs.completed_at
    FROM game_sessions gs
    JOIN users u ON gs.user_id = u.id
    WHERE u.is_parent = 0
    ORDER BY gs.completed_at DESC
    LIMIT 50`,
    [],
    (err, sessions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(sessions);
    }
  );
});

// Delete a child user
router.delete('/users/:userId', (req, res) => {
  const { userId } = req.params;
  const db = getDB();

  // First check if user exists and is not a parent
  db.get(
    'SELECT is_parent FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (user.is_parent === 1) {
        return res.status(403).json({ error: 'Cannot delete parent account' });
      }

      // Delete all related data
      db.serialize(() => {
        db.run('DELETE FROM game_sessions WHERE user_id = ?', [userId]);
        db.run('DELETE FROM progress WHERE user_id = ?', [userId]);
        db.run('DELETE FROM achievements WHERE user_id = ?', [userId]);
        db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'User deleted successfully' });
        });
      });
    }
  );
});

module.exports = router;
