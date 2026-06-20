import axios from "axios";
import { API_ROOT } from "../constants.js";

const baseURL = API_ROOT;

const api = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 410 ||
      error.response?.data?.message === "Need to refresh token!";
    let refreshTokenPromise: Promise<string> | null = null;

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshTokenPromise) {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) throw new Error("No refresh token");

          refreshTokenPromise = axios
            .post(`${baseURL}/users/refresh_token`, { refreshToken })
            .then(({ data }) => {
              localStorage.setItem("access_token", data.accessToken);
              return data.accessToken;
            })
            .finally(() => {
              refreshTokenPromise = null;
            });
        }

        const accessToken = await refreshTokenPromise;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
  },
);

export default api;
