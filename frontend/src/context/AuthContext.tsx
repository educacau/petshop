import {createContext, ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import api from '../services/api';
import {storage} from '../utils/storage';
import type {User} from '../types';

type AuthResponse = {
  token: string;
  user: User;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {name: string; email: string; password: string; phone?: string}) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(() => storage.getUser());
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<{data: AuthResponse}>('/auth/login', {email, password});
    const auth = response.data.data;
    const {token: jwt, user: responseUser} = auth;
    storage.setToken(jwt);
    storage.setUser(responseUser);
    setToken(jwt);
    setUser(responseUser);
    navigate('/dashboard');
  }, [navigate]);

  const register = useCallback(async (data: {name: string; email: string; password: string; phone?: string}) => {
    await api.post('/auth/register', data);
    await login(data.email, data.password);
  }, [login]);

  const logout = useCallback(() => {
    storage.clearToken();
    storage.clearUser();
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (!token) return;

    api
      .get('/auth/me')
      .then(response => {
        if (response.data?.data) {
          storage.setUser(response.data.data);
          setUser(response.data.data);
        }
      })
      .catch(() => logout());
  }, [token, logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout
    }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


