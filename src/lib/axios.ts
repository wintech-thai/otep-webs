import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// สูตร Base64 มาตรฐาน รองรับภาษาไทย
const toBase64 = (str: string) => {
  if (!str) return "";
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (err) {
    return str;
  }
};

export const apiClient = axios.create({
  baseURL: "/api-proxy", 
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("auth_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get("refresh_token");
        const currentOrg = localStorage.getItem("current_org") || "temp";
        const encodedOrg = toBase64(currentOrg === "default" ? "temp" : currentOrg);

        const { data } = await axios.post(`/api-proxy/api/Auth/org/${encodedOrg}/action/Refresh`, { refreshToken });
        const newToken = data?.token?.access_token || data?.accessToken;
        
        if (newToken) {
          Cookies.set("auth_token", newToken);
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        // Handle Logout if refresh fails
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);