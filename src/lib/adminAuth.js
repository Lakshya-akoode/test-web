// Admin authentication utilities
export const getAdminToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

export const getAdmin = () => {
  if (typeof window !== 'undefined') {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }
  return null;
};

export const setAdminAuth = (token, admin) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('admin', JSON.stringify(admin));
  }
};

export const clearAdminAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
  }
};

export const isAdminAuthenticated = () => {
  return getAdminToken() !== null;
};

export const getAdminAuthHeaders = () => {
  const token = getAdminToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};










