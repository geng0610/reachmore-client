// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const setupAxiosInterceptors = (getToken: () => Promise<string | null>) => {
  api.interceptors.request.use(
    async (config) => {
      const token = await getToken(); // Fetch the token when making requests
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// New API functions for user preferences
export const getUserPreferences = () =>
  api.get(`/api/user-preferences/`);

export const updateUserPreferences = (data: any) =>
  api.put(`/api/user-preferences/`, data);

// New API functions for audience lists
export const createAudienceList = (data: any) => api.post('/api/audience-lists', data);
export const getAudienceLists = () => api.get('/api/audience-lists');
export const getAudienceList = (id: string) => api.get(`/api/audience-lists/${id}`);
export const updateAudienceList = (id: string, data: any) => api.put(`/api/audience-lists/${id}`, data);


// New API functions for audience queries
export const generateQuery = (audienceListId: string) => {return api.post('/api/audience-queries', { audienceListId });};
export const getLatestQuery = (audienceListId: string) => {return api.get(`/api/audience-queries/${audienceListId}/latest`);};


export default api;
