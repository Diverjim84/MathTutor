// Math curriculum organized by grade level (K-5)
const curriculum = {
  K: {
    name: 'Kindergarten',
    skills: [
      {
        id: 'counting',
        name: 'Counting 1-20',
        generate: () => {
          const num = Math.floor(Math.random() * 20) + 1;
          return {
            question: `What number comes after ${num}?`,
            answer: num + 1,
            type: 'number'
          };
        }
      },
      {
        id: 'addition_to_5',
        name: 'Addition up to 5',
        generate: () => {
          const a = Math.floor(Math.random() * 6);
          const b = Math.floor(Math.random() * (6 - a));
          return {
            question: `${a} + ${b} = ?`,
            answer: a + b,
            type: 'number'
          };
        }
      },
      {
        id: 'subtraction_to_5',
        name: 'Subtraction up to 5',
        generate: () => {
          const total = Math.floor(Math.random() * 6);
          const subtract = Math.floor(Math.random() * (total + 1));
          return {
            question: `${total} - ${subtract} = ?`,
            answer: total - subtract,
            type: 'number'
          };
        }
      }
    ]
  },
  1: {
    name: '1st Grade',
    skills: [
      {
        id: 'addition_to_20',
        name: 'Addition up to 20',
        generate: () => {
          const a = Math.floor(Math.random() * 21);
          const b = Math.floor(Math.random() * (21 - a));
          return {
            question: `${a} + ${b} = ?`,
            answer: a + b,
            type: 'number'
          };
        }
      },
      {
        id: 'subtraction_to_20',
        name: 'Subtraction up to 20',
        generate: () => {
          const total = Math.floor(Math.random() * 21);
          const subtract = Math.floor(Math.random() * (total + 1));
          return {
            question: `${total} - ${subtract} = ?`,
            answer: total - subtract,
            type: 'number'
          };
        }
      },
      {
        id: 'tens_reciprocals',
        name: 'Tens Reciprocals',
        generate: () => {
          const pairs = [[1, 9], [2, 8], [3, 7], [4, 6], [5, 5]];
          const pair = pairs[Math.floor(Math.random() * pairs.length)];
          const first = Math.random() > 0.5 ? pair[0] : pair[1];
          const second = 10 - first;
          return {
            question: `${first} + ? = 10`,
            answer: second,
            type: 'number'
          };
        }
      }
    ]
  },
  2: {
    name: '2nd Grade',
    skills: [
      {
        id: 'addition_to_100',
        name: 'Addition up to 100',
        generate: () => {
          const a = Math.floor(Math.random() * 51);
          const b = Math.floor(Math.random() * (51 - a));
          return {
            question: `${a} + ${b} = ?`,
            answer: a + b,
            type: 'number'
          };
        }
      },
      {
        id: 'subtraction_to_100',
        name: 'Subtraction up to 100',
        generate: () => {
          const total = Math.floor(Math.random() * 101);
          const subtract = Math.floor(Math.random() * (total + 1));
          return {
            question: `${total} - ${subtract} = ?`,
            answer: total - subtract,
            type: 'number'
          };
        }
      },
      {
        id: 'times_tables_2_5',
        name: 'Times Tables (2s, 5s, 10s)',
        generate: () => {
          const tables = [2, 5, 10];
          const base = tables[Math.floor(Math.random() * tables.length)];
          const multiplier = Math.floor(Math.random() * 10) + 1;
          return {
            question: `${base} × ${multiplier} = ?`,
            answer: base * multiplier,
            type: 'number'
          };
        }
      }
    ]
  },
  3: {
    name: '3rd Grade',
    skills: [
      {
        id: 'multiplication',
        name: 'Multiplication up to 10×10',
        generate: () => {
          const a = Math.floor(Math.random() * 10) + 1;
          const b = Math.floor(Math.random() * 10) + 1;
          return {
            question: `${a} × ${b} = ?`,
            answer: a * b,
            type: 'number'
          };
        }
      },
      {
        id: 'division',
        name: 'Basic Division',
        generate: () => {
          const divisor = Math.floor(Math.random() * 9) + 2;
          const quotient = Math.floor(Math.random() * 10) + 1;
          const dividend = divisor * quotient;
          return {
            question: `${dividend} ÷ ${divisor} = ?`,
            answer: quotient,
            type: 'number'
          };
        }
      },
      {
        id: 'times_tables_all',
        name: 'All Times Tables (1-10)',
        generate: () => {
          const a = Math.floor(Math.random() * 10) + 1;
          const b = Math.floor(Math.random() * 10) + 1;
          return {
            question: `${a} × ${b} = ?`,
            answer: a * b,
            type: 'number'
          };
        }
      }
    ]
  },
  4: {
    name: '4th Grade',
    skills: [
      {
        id: 'multi_digit_addition',
        name: 'Multi-digit Addition',
        generate: () => {
          const a = Math.floor(Math.random() * 1000) + 100;
          const b = Math.floor(Math.random() * 1000) + 100;
          return {
            question: `${a} + ${b} = ?`,
            answer: a + b,
            type: 'number'
          };
        }
      },
      {
        id: 'multi_digit_subtraction',
        name: 'Multi-digit Subtraction',
        generate: () => {
          const a = Math.floor(Math.random() * 1000) + 500;
          const b = Math.floor(Math.random() * (a - 100)) + 100;
          return {
            question: `${a} - ${b} = ?`,
            answer: a - b,
            type: 'number'
          };
        }
      },
      {
        id: 'multiplication_2_digit',
        name: 'Two-digit Multiplication',
        generate: () => {
          const a = Math.floor(Math.random() * 90) + 10;
          const b = Math.floor(Math.random() * 9) + 2;
          return {
            question: `${a} × ${b} = ?`,
            answer: a * b,
            type: 'number'
          };
        }
      },
      {
        id: 'fractions_basic',
        name: 'Basic Fractions',
        generate: () => {
          const numerator = Math.floor(Math.random() * 4) + 1;
          const denominator = Math.floor(Math.random() * 4) + numerator + 1;
          const multiplier = Math.floor(Math.random() * 3) + 2;
          return {
            question: `${numerator}/${denominator} is equivalent to ?/${denominator * multiplier}`,
            answer: numerator * multiplier,
            type: 'number'
          };
        }
      }
    ]
  },
  5: {
    name: '5th Grade',
    skills: [
      {
        id: 'decimals_addition',
        name: 'Decimal Addition',
        generate: () => {
          const a = (Math.random() * 100).toFixed(2);
          const b = (Math.random() * 100).toFixed(2);
          const answer = (parseFloat(a) + parseFloat(b)).toFixed(2);
          return {
            question: `${a} + ${b} = ?`,
            answer: parseFloat(answer),
            type: 'number',
            precision: 2
          };
        }
      },
      {
        id: 'decimals_multiplication',
        name: 'Decimal Multiplication',
        generate: () => {
          const a = (Math.random() * 10).toFixed(1);
          const b = (Math.random() * 10).toFixed(1);
          const answer = (parseFloat(a) * parseFloat(b)).toFixed(2);
          return {
            question: `${a} × ${b} = ?`,
            answer: parseFloat(answer),
            type: 'number',
            precision: 2
          };
        }
      },
      {
        id: 'fractions_operations',
        name: 'Fraction Operations',
        generate: () => {
          const num1 = Math.floor(Math.random() * 4) + 1;
          const num2 = Math.floor(Math.random() * 4) + 1;
          const denom = Math.floor(Math.random() * 5) + 3;
          const operation = Math.random() > 0.5 ? '+' : '-';
          const answer = operation === '+' ? num1 + num2 : Math.abs(num1 - num2);
          return {
            question: `${num1}/${denom} ${operation} ${num2}/${denom} = ?/${denom}`,
            answer: answer,
            type: 'number',
            hint: 'Enter just the numerator'
          };
        }
      },
      {
        id: 'percentages',
        name: 'Basic Percentages',
        generate: () => {
          const percent = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
          const number = Math.floor(Math.random() * 10) * 10 + 20;
          const answer = (number * percent) / 100;
          return {
            question: `What is ${percent}% of ${number}?`,
            answer: answer,
            type: 'number'
          };
        }
      }
    ]
  }
};

// Special game modes
const specialModes = {
  times_tables: {
    name: 'Times Tables Practice',
    generate: (level = 'all') => {
      let a, b;
      if (level === 'all') {
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
      } else {
        const table = parseInt(level);
        a = table;
        b = Math.floor(Math.random() * 12) + 1;
      }
      return {
        question: `${a} × ${b} = ?`,
        answer: a * b,
        type: 'number'
      };
    }
  },
  tens_reciprocals: {
    name: 'Tens Reciprocals',
    generate: () => {
      const pairs = [[1, 9], [2, 8], [3, 7], [4, 6], [5, 5]];
      const pair = pairs[Math.floor(Math.random() * pairs.length)];
      const first = Math.random() > 0.5 ? pair[0] : pair[1];
      const second = 10 - first;
      return {
        question: `${first} + ? = 10`,
        answer: second,
        type: 'number'
      };
    }
  }
};

function getSkillsForGrade(grade) {
  return curriculum[grade] || null;
}

function generateQuestion(gameType, gradeLevel, skillId) {
  // Check if it's a special mode
  if (specialModes[gameType]) {
    return specialModes[gameType].generate();
  }

  // Grade-level skill
  const gradeData = curriculum[gradeLevel];
  if (!gradeData) {
    throw new Error('Invalid grade level');
  }

  if (skillId) {
    const skill = gradeData.skills.find(s => s.id === skillId);
    if (!skill) {
      throw new Error('Invalid skill ID');
    }
    return skill.generate();
  }

  // Random skill from grade
  const skill = gradeData.skills[Math.floor(Math.random() * gradeData.skills.length)];
  return skill.generate();
}

function checkAnswer(userAnswer, correctAnswer, precision = 0) {
  const user = parseFloat(userAnswer);
  const correct = parseFloat(correctAnswer);

  if (precision > 0) {
    return Math.abs(user - correct) < Math.pow(10, -precision);
  }

  return user === correct;
}

module.exports = {
  curriculum,
  specialModes,
  getSkillsForGrade,
  generateQuestion,
  checkAnswer
};
