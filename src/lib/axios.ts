import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api-dev.otep.triple-t.co",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // ถ้ายังไม่มี (undefined) ค่อยไปดึงจาก Cookie
    if (!config.headers.Authorization) {
        const token = Cookies.get("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor 
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Session expired, redirecting to login...");
      
      Cookies.remove("auth_token");
      localStorage.removeItem("user_info");

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    // ...
    return Promise.reject(error);
  }
);