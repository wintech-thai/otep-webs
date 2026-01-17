import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api-dev.otep.triple-t.co", // ใส่ Fallback เผื่อไว้
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 1. Request Interceptor: แนบ Token อัตโนมัติ ---
apiClient.interceptors.request.use(
  (config) => {
    // ดึง Token จาก Cookie
    const token = Cookies.get("auth_token");
    
    // ถ้ามี Token ให้แนบไปกับ Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. Response Interceptor: จัดการ Error (เช่น Token หมดอายุ) ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ถ้าเจอ 401 (Unauthorized) แปลว่า Token หมดอายุ หรือ ปลอม
    if (error.response && error.response.status === 401) {
      console.error("Session expired, redirecting to login...");
      
      // 1. ลบ Token ทิ้ง
      Cookies.remove("auth_token");
      
      // 2. ลบข้อมูล User (ถ้ามี)
      localStorage.removeItem("user_info");

      // 3. ดีดกลับไปหน้า Login (ใช้ window.location เพื่อรีเซ็ต State ทั้งหมด)
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    // ถ้าเป็น 403 (Forbidden) อาจจะแค่แจ้งเตือน ไม่ต้อง Logout
    if (error.response && error.response.status === 403) {
      console.error("Permission Denied");
    }

    return Promise.reject(error);
  }
);