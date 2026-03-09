import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Users ──────────────────────────────────────────
export const registerUser = (data) => api.post('/users', data);
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// ─── Habits ─────────────────────────────────────────
export const createHabit = (data) => api.post('/habits', data);
export const getHabits = () => api.get('/habits');
export const getHabitById = (id) => api.get(`/habits/${id}`);
export const updateHabit = (id, data) => api.put(`/habits/${id}`, data);
export const deleteHabit = (id) => api.delete(`/habits/${id}`);

// ─── Goals ──────────────────────────────────────────
export const createGoal = (data) => api.post('/goals', data);
export const getGoals = () => api.get('/goals');
export const getGoalById = (id) => api.get(`/goals/${id}`);
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);

export default api;
