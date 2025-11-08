// AI opponent logic for racing mode
class AIOpponent {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.setupDifficulty();
  }

  setupDifficulty() {
    const settings = {
      easy: {
        minTime: 5000,    // 5 seconds
        maxTime: 10000,   // 10 seconds
        errorRate: 0.15,  // 15% error rate
        name: 'Timmy the Turtle',
        avatar: '🐢'
      },
      medium: {
        minTime: 3000,    // 3 seconds
        maxTime: 6000,    // 6 seconds
        errorRate: 0.08,  // 8% error rate
        name: 'Rosie the Rabbit',
        avatar: '🐰'
      },
      hard: {
        minTime: 2000,    // 2 seconds
        maxTime: 4000,    // 4 seconds
        errorRate: 0.03,  // 3% error rate
        name: 'Charlie the Cheetah',
        avatar: '🐆'
      },
      expert: {
        minTime: 1000,    // 1 second
        maxTime: 2500,    // 2.5 seconds
        errorRate: 0.01,  // 1% error rate
        name: 'Einstein the Owl',
        avatar: '🦉'
      }
    };

    const config = settings[this.difficulty] || settings.medium;
    Object.assign(this, config);
  }

  // Calculate how long AI takes to answer
  getResponseTime() {
    // Random time within the difficulty range
    const baseTime = Math.random() * (this.maxTime - this.minTime) + this.minTime;

    // Add some natural variation (±20%)
    const variation = (Math.random() - 0.5) * 0.4;
    return baseTime * (1 + variation);
  }

  // Determine if AI makes a mistake
  makesMistake() {
    return Math.random() < this.errorRate;
  }

  // Generate a plausible wrong answer
  generateWrongAnswer(correctAnswer) {
    const strategies = [
      // Off by one
      () => correctAnswer + (Math.random() > 0.5 ? 1 : -1),
      // Off by small amount
      () => correctAnswer + Math.floor(Math.random() * 5) - 2,
      // Digit error (swap or wrong digit)
      () => {
        const str = correctAnswer.toString();
        if (str.length > 1) {
          const idx = Math.floor(Math.random() * str.length);
          const newDigit = Math.floor(Math.random() * 10);
          return parseInt(str.substring(0, idx) + newDigit + str.substring(idx + 1));
        }
        return correctAnswer + Math.floor(Math.random() * 3) + 1;
      },
      // Multiplication/division error (for those operations)
      () => {
        const factors = [2, 3, 5, 10];
        const factor = factors[Math.floor(Math.random() * factors.length)];
        return Math.random() > 0.5 ? correctAnswer * factor : Math.floor(correctAnswer / factor);
      }
    ];

    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const wrongAnswer = strategy();

    // Make sure it's different from correct answer and positive
    return wrongAnswer === correctAnswer || wrongAnswer < 0
      ? correctAnswer + Math.floor(Math.random() * 5) + 1
      : wrongAnswer;
  }

  // Simulate AI answering a question
  simulateAnswer(correctAnswer) {
    const responseTime = this.getResponseTime();
    const isCorrect = !this.makesMistake();
    const answer = isCorrect ? correctAnswer : this.generateWrongAnswer(correctAnswer);

    return {
      answer,
      responseTime: Math.round(responseTime),
      isCorrect,
      aiName: this.name,
      aiAvatar: this.avatar
    };
  }

  getInfo() {
    return {
      name: this.name,
      avatar: this.avatar,
      difficulty: this.difficulty,
      speed: `${(this.minTime / 1000).toFixed(1)}-${(this.maxTime / 1000).toFixed(1)}s`,
      accuracy: `${((1 - this.errorRate) * 100).toFixed(0)}%`
    };
  }
}

module.exports = AIOpponent;
