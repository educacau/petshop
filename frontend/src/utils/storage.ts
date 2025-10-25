const TOKEN_KEY = 'petshop:token';
const USER_KEY = 'petshop:user';

type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
};

const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const getToken = () => localStorage.getItem(TOKEN_KEY);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const setUser = (user: StoredUser) => localStorage.setItem(USER_KEY, JSON.stringify(user));
const getUser = (): StoredUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as StoredUser) : null;
};
const clearUser = () => localStorage.removeItem(USER_KEY);

export const storage = {
  setToken,
  getToken,
  clearToken,
  setUser,
  getUser,
  clearUser
};
