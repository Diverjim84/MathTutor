const express = require('express');
const { getDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get current user info
router.get('/me', authenticateToken, (req, res) => {
  const db = getDB();
  db.get(
    'SELECT id, username, is_parent, grade_level, avatar, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        id: user.id,
        username: user.username,
        isParent: user.is_parent === 1,
        gradeLevel: user.grade_level,
        avatar: user.avatar,
        createdAt: user.created_at
      });
    }
  );
});

// Update user profile
router.patch('/me', authenticateToken, (req, res) => {
  const { gradeLevel, avatar } = req.body;
  const updates = [];
  const values = [];

  if (gradeLevel !== undefined) {
    updates.push('grade_level = ?');
    values.push(gradeLevel);
  }
  if (avatar) {
    updates.push('avatar = ?');
    values.push(avatar);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No updates provided' });
  }

  values.push(req.user.id);

  const db = getDB();
  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values,
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

module.exports = router;
