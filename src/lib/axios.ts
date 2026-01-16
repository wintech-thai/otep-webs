import axios from "axios";

// สร้าง instance ของ Axios และ Export ออกไปใช้งาน
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor: จัดการ Error Global (เช่น 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ถ้าเจอ 401 (Unauthorized) หรือ 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Authentication Error:", error.response.status);
      
      // TODO: ใส่ Logic Refresh Token หรือ Redirect ไปหน้า Login ตรงนี้
      // if (typeof window !== "undefined") {
      //   window.location.href = "/login";
      // }
    }
    return Promise.reject(error);
  }
);