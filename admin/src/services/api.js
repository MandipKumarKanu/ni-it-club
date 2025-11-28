import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Use environment variable or default to local backend
export const baseURL ="https://ni-it-club.vercel.app/api";

export const customAxios = axios.create({
  baseURL,
  withCredentials: true,
});

export const setupInterceptors = (getToken, setToken, updateUser) => {
  let tokenPromise = null;

  customAxios.interceptors.request.use(
    async (config) => {
      const token = getToken && getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  customAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Prevent infinite loops
      if (originalRequest.url.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // Check if error is 401 (Unauthorized) and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._isRetry) {
        originalRequest._isRetry = true;

        // If a refresh is already in progress, wait for it
        if (tokenPromise) {
          try {
            const token = await tokenPromise;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return customAxios(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        // Start a new refresh
        tokenPromise = new Promise(async (resolve, reject) => {
          try {
            const response = await axios.post(
              `${baseURL}/auth/refresh`,
              {},
              {
                withCredentials: true,
              }
            );

            const { accessToken } = response.data;
            setToken(accessToken);
            resolve(accessToken);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            // Logout if refresh fails
            setToken(null);
            updateUser(null);
            reject(refreshError);
            // Do NOT redirect to login here, let the UI handle it
            // window.location.href = "/login";
          } finally {
            tokenPromise = null;
          }
        });

        try {
          const token = await tokenPromise;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return customAxios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default customAxios;
