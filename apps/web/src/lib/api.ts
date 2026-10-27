import { PairUpApiClient } from '@pairup/api-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiClient = new PairUpApiClient({
  baseUrl: API_BASE_URL,
  getAccessToken: () => localStorage.getItem('pairup_access_token'),
  setAccessToken: (token) => {
    if (token) localStorage.setItem('pairup_access_token', token);
    else localStorage.removeItem('pairup_access_token');
  },
  onUnauthorized: () => {
    localStorage.removeItem('pairup_access_token');
    if (!window.location.pathname.startsWith('/auth') && window.location.pathname !== '/') {
      window.location.href = '/auth';
    }
  }
});
