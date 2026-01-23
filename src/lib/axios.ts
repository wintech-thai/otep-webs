import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import https from "https";

const toBase64 = (str: string) => {
  if (!str) return "";
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (err) { return str; }
};

export const apiClient = axios.create({
  baseURL: "/api-proxy", 
  headers: { "Content-Type": "application/json" },
  httpsAgent: new https.Agent({  
    rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true,
    keepAlive: true 
  })
});

// Queue Logic
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
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
    const token = Cookies.get("auth_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${toBase64(token)}`;
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
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token: any) => {
            const bearer = `Bearer ${toBase64(token)}`;
            originalRequest.headers["Authorization"] = bearer;
            return apiClient(originalRequest);
        }).catch((err) => {
            return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) throw new Error("No refresh token available");

        const currentOrg = localStorage.getItem("current_org") || "temp";
        const targetOrg = currentOrg === "default" ? "temp" : currentOrg;

        const { data } = await axios.post(`/api-proxy/api/Auth/org/${targetOrg}/action/Refresh`, { 
          refreshToken 
        });

        const newToken = data?.token?.access_token || data?.accessToken;
        
        if (newToken) {
          Cookies.set("auth_token", newToken);
          
          const bearer = `Bearer ${toBase64(newToken)}`;
          apiClient.defaults.headers.common["Authorization"] = bearer;
          originalRequest.headers["Authorization"] = bearer;
          
          processQueue(null, newToken);
          
          return apiClient(originalRequest);
        } else {
            throw new Error("Refresh failed: No token returned");
        }
      } catch (err) {
        processQueue(err, null);
        
        Cookies.remove("auth_token");
        Cookies.remove("refresh_token");
        
        if (typeof window !== "undefined") {
             window.location.href = "/auth/login"; 
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);