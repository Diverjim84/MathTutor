const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const db = getDB();
  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      bcrypt.compare(password, user.password, (err, match) => {
        if (err || !match) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            isParent: user.is_parent === 1,
            gradeLevel: user.grade_level
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            isParent: user.is_parent === 1,
            gradeLevel: user.grade_level,
            avatar: user.avatar
          }
        });
      });
    }
  );
});

// Register new user (child account)
router.post('/register', (req, res) => {
  const { username, password, gradeLevel, avatar } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const db = getDB();

  db.run(
    'INSERT INTO users (username, password, grade_level, avatar) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, gradeLevel || 0, avatar || '🧒'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }

      const token = jwt.sign(
        {
          id: this.lastID,
          username,
          isParent: false,
          gradeLevel: gradeLevel || 0
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: this.lastID,
          username,
          isParent: false,
          gradeLevel: gradeLevel || 0,
          avatar: avatar || '🧒'
        }
      });
    }
  );
});

module.exports = router;
