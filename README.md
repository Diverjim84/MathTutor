# Math Tutor Game 🎓

A fun, interactive Docker-hosted web application that helps children practice math skills from Kindergarten through 5th grade. Features engaging gameplay with AI opponents, progress tracking, and a parent dashboard for monitoring learning.

## Features

### For Kids 👦👧
- **Grade-Level Math Practice** (K-5th Grade)
  - Kindergarten: Counting, addition/subtraction to 5
  - 1st Grade: Addition/subtraction to 20, tens reciprocals
  - 2nd Grade: Addition/subtraction to 100, times tables (2s, 5s, 10s)
  - 3rd Grade: Multiplication & division, all times tables
  - 4th Grade: Multi-digit operations, basic fractions
  - 5th Grade: Decimals, percentages, advanced fractions

- **Special Practice Modes**
  - Times Tables Memorization (1-12)
  - Tens Reciprocals ([1,9], [2,8], [3,7], [4,6], [5,5])

- **Race Mode** 🏁
  - Compete against AI opponents
  - 4 difficulty levels: Easy (Turtle), Medium (Rabbit), Hard (Cheetah), Expert (Owl)
  - AI makes realistic mistakes based on difficulty
  - Real-time score tracking

- **Progress Tracking** 📊
  - Track accuracy per skill
  - View game history
  - Earn achievements
  - See improvement over time

### For Parents 👨‍👩‍👧‍👦
- **Password-Protected Dashboard**
- **Multi-User Support**
  - Create accounts for multiple children
  - Each child has their own avatar and grade level
- **Detailed Statistics**
  - View each child's progress
  - See skill mastery levels
  - Monitor game history
  - Track accuracy and time spent
- **Activity Feed**
  - Real-time updates on children's practice sessions

## Technology Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Containerization**: Docker + Docker Compose
- **AI Opponent**: Custom JavaScript logic with difficulty scaling

## Quick Start

### Prerequisites
- Docker
- Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MathTutor
   ```

2. **Configure environment variables (optional)**
   ```bash
   cp .env.example .env
   # Edit .env to customize ports or use Ollama/Whisper/TTS services
   ```

   **Port Configuration:**
   - `BACKEND_PORT` - Backend API port (default: 3000)
   - `FRONTEND_PORT` - Frontend web port (default: 5173)

3. **Build and start the application**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Default Credentials

**Parent Account:**
- Username: `parent`
- Password: `parent123`

**Note:** Change the default password after first login!

## Usage

### Creating Child Accounts

1. Click "Register" on the login page
2. Enter username and password
3. Select grade level
4. Choose an avatar
5. Start playing!

### Playing Games

1. Login with your account
2. Choose a game mode:
   - Special modes (Times Tables, Tens Reciprocals)
   - Grade level practice
3. Configure settings:
   - Enable/disable Race Mode
   - Select AI difficulty
   - Choose number of questions
4. Answer questions and compete!

### Parent Dashboard

1. Login with parent account
2. View all children
3. Click on a child to see detailed statistics
4. Monitor recent activity
5. Manage accounts (delete if needed)

## Project Structure

```
MathTutor/
├── backend/
│   ├── src/
│   │   ├── server.js           # Main server file
│   │   ├── database.js         # SQLite database setup
│   │   ├── curriculum.js       # Math curriculum & question generation
│   │   ├── aiOpponent.js       # AI opponent logic
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT authentication
│   │   └── routes/
│   │       ├── auth.js         # Login/register endpoints
│   │       ├── users.js        # User management
│   │       ├── games.js        # Game logic & sessions
│   │       ├── progress.js     # Progress tracking
│   │       └── parent.js       # Parent dashboard API
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Main app component
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── services/
│   │   │   └── api.js          # API client
│   │   ├── components/
│   │   │   └── Navbar.jsx      # Navigation bar
│   │   └── pages/
│   │       ├── Login.jsx       # Login/register page
│   │       ├── Dashboard.jsx   # Game selection
│   │       ├── Game.jsx        # Game interface
│   │       ├── Progress.jsx    # Progress tracking
│   │       └── ParentDashboard.jsx # Parent dashboard
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── data/                       # SQLite database (auto-created)
├── docker-compose.yml
├── .env.example
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user

### Users
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update profile

### Games
- `GET /api/games/curriculum` - Get available games
- `POST /api/games/start` - Start new game session
- `POST /api/games/answer` - Submit answer
- `GET /api/games/history` - Get game history

### Progress
- `GET /api/progress` - Get user progress
- `GET /api/progress/achievements` - Get achievements
- `GET /api/progress/leaderboard/:gameType` - Get leaderboard

### Parent (requires parent authentication)
- `GET /api/parent/users` - Get all children
- `GET /api/parent/users/:userId/stats` - Get child statistics
- `GET /api/parent/activity` - Get recent activity
- `DELETE /api/parent/users/:userId` - Delete child account

## Optional: AI Services Integration

The application can be configured to work with Ollama, Whisper, and TTS services using OpenAI API format.

### Setup

1. Edit `.env` file:
   ```env
   OLLAMA_URL=http://localhost:11434/v1
   WHISPER_URL=http://localhost:8000/v1
   TTS_URL=http://localhost:8001/v1
   OPENAI_API_KEY=your-api-key
   ```

2. Restart the containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

**Note:** AI services integration is optional and not required for core functionality.

## Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Database

The SQLite database is automatically created on first run. It includes:
- User accounts with authentication
- Game sessions and scores
- Progress tracking per skill
- Achievements system

Database file: `./data/mathtutor.db`

## Troubleshooting

### Port Already in Use
If ports 3000 or 5173 are already in use, modify the `.env` file:
```env
BACKEND_PORT=3001
FRONTEND_PORT=5174
```

Then restart the containers:
```bash
docker-compose down
docker-compose up -d
```

### Database Issues
To reset the database:
```bash
docker-compose down
rm -f data/mathtutor.db
docker-compose up -d
```

### Container Logs
View logs for debugging:
```bash
docker-compose logs backend
docker-compose logs frontend
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - feel free to use this project for educational purposes.

## Acknowledgments

- Built with React, Node.js, and SQLite
- Designed for children's math education
- AI opponent system inspired by game difficulty scaling
- Math curriculum aligned with US K-5 standards

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Open an issue on GitHub

---

Made with ❤️ for kids learning math!
