const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../data/mathtutor.db');

let db;

function getDB() {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
      }
    });
  }
  return db;
}

function initialize() {
  const db = getDB();

  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_parent BOOLEAN DEFAULT 0,
        grade_level INTEGER DEFAULT 0,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Game sessions table
    db.run(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_type TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        grade_level INTEGER,
        score INTEGER DEFAULT 0,
        total_questions INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        time_taken INTEGER,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Progress tracking table
    db.run(`
      CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        skill_type TEXT NOT NULL,
        skill_level TEXT NOT NULL,
        mastery_level INTEGER DEFAULT 0,
        total_attempts INTEGER DEFAULT 0,
        successful_attempts INTEGER DEFAULT 0,
        last_practiced DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, skill_type, skill_level)
      )
    `);

    // Achievements table
    db.run(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        achievement_type TEXT NOT NULL,
        earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Check if default parent account exists
    db.get('SELECT id FROM users WHERE is_parent = 1', (err, row) => {
      if (!row) {
        // Create default parent account (password: parent123)
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('parent123', 10);
        db.run(
          'INSERT INTO users (username, password, is_parent) VALUES (?, ?, 1)',
          ['parent', hashedPassword],
          (err) => {
            if (!err) {
              console.log('Default parent account created (username: parent, password: parent123)');
            }
          }
        );
      }
    });
  });
}

module.exports = {
  getDB,
  initialize
};
