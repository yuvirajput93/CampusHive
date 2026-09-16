import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.PROD 
    ? `${import.meta.env.VITE_API_URL}/api/v1` 
    : '/api/v1',
  withCredentials: true,
});

// Adds the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handles token refresh on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // --- START OF THE FIX ---
      // Check if a refresh token exists before trying to use it.
      // This is a simple way to check cookies from the client-side.
      const refreshTokenExists = document.cookie.includes("refreshToken=");

      if (!refreshTokenExists) {
        // If no refresh token, the user is just not logged in.
        // Don't try to refresh, just fail. This cleans the console.
        return Promise.reject(error);
      }
      // --- END OF THE FIX ---

      try {
        await apiClient.post('/user/refresh');
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;