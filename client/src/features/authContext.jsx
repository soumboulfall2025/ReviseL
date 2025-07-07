import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    if (token && userInfo) {
      setUser({ token, ...JSON.parse(userInfo) });
    } else if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem('token', token);
    if (userInfo) localStorage.setItem('user', JSON.stringify(userInfo));
    setUser({ token, ...userInfo });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
