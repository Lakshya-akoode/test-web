// Client-side authentication utilities
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userToken');
  }
  return null;
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setAuth = (token, user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
  }
};

export const isAuthenticated = () => {
  return getToken() !== null;
};








