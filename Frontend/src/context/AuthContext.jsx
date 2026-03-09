import { createContext, useContext, useState, useEffect } from 'react';
import { getUsers, registerUser } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ht_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('ht_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data: users } = await getUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) throw new Error('Invalid email or password');
    setUser(found);
    localStorage.setItem('ht_user', JSON.stringify(found));
    return found;
  };

  const register = async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    const newUser = data.user;
    setUser(newUser);
    localStorage.setItem('ht_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ht_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
