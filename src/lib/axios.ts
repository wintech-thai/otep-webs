import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const toBase64 = (str: string) => {
  if (!str) return "";
  try {
    return btoa(str); 
  } catch (err) {
    return str;
  }
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api-dev.otep.triple-t.co",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.headers?.Authorization) {
      return config;
    }

    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/action/Refresh")) {
        handleLogout();
        return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(function(resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = Cookies.get("refresh_token");
      
      if (!refreshToken) {
          throw new Error("No refresh token available");
      }

      let currentOrg = "temp";
      if (typeof window !== "undefined") {
          const storedOrg = localStorage.getItem("current_org");
          if (storedOrg && storedOrg !== "default") {
              currentOrg = storedOrg;
          }
      }
      
      const encodedOrg = toBase64(currentOrg);

      const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "https://api-dev.otep.triple-t.co"}/api/Auth/org/${encodedOrg}/action/Refresh`, 
          { 
              refreshToken: refreshToken 
          } 
      );

      const newAccessToken = data?.token?.access_token || data?.accessToken;
      const newRefreshToken = data?.token?.refresh_token || data?.refreshToken;

      if (!newAccessToken) throw new Error("Refresh failed: No access token returned");

      Cookies.set("auth_token", newAccessToken, { expires: 1 }); 
      if (newRefreshToken) {
          Cookies.set("refresh_token", newRefreshToken, { expires: 7 });
      }
      
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      
      processQueue(null, newAccessToken);
      isRefreshing = false;

      if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return apiClient(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;
      handleLogout();
      
      return Promise.reject(refreshError);
    }
  }
);

const handleLogout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("current_org");
    
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
         window.location.href = "/login";
    }
};