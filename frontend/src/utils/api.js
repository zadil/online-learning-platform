// Utilitaire pour l'URL de base de l'API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://8080-iucjd9gfctt6852icaxiq-6532622b.e2b.dev';

// Fonction helper pour construire les URLs d'API
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

// Fonction helper pour les appels fetch avec configuration par défaut
export const fetchApi = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  return fetch(url, {
    ...options,
    headers: defaultHeaders
  });
};