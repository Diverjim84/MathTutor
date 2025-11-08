import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  register: (username, password, gradeLevel, avatar) =>
    api.post('/auth/register', { username, password, gradeLevel, avatar })
};

// User API
export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data)
};

// Game API
export const gameAPI = {
  getCurriculum: (gradeLevel) =>
    api.get('/games/curriculum', { params: { gradeLevel } }),
  startGame: (gameData) => api.post('/games/start', gameData),
  submitAnswer: (answerData) => api.post('/games/answer', answerData),
  getSession: (sessionId) => api.get(`/games/session/${sessionId}`),
  getHistory: () => api.get('/games/history')
};

// Progress API
export const progressAPI = {
  getProgress: () => api.get('/progress'),
  getSkillProgress: (skillType, skillLevel) =>
    api.get(`/progress/${skillType}/${skillLevel}`),
  getAchievements: () => api.get('/progress/achievements'),
  getLeaderboard: (gameType) => api.get(`/progress/leaderboard/${gameType}`)
};

// Parent API
export const parentAPI = {
  getUsers: () => api.get('/parent/users'),
  getUserStats: (userId) => api.get(`/parent/users/${userId}/stats`),
  getActivity: () => api.get('/parent/activity'),
  deleteUser: (userId) => api.delete(`/parent/users/${userId}`)
};

export default api;
