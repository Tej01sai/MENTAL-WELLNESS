// src/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('mw_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem('mw_user', JSON.stringify(user));
      else localStorage.removeItem('mw_user');
    } catch {
      // ignore storage errors
    }
  }, [user]);

  const login = (userData) => setUser(userData || { username: 'user' });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
