import Cookies from "js-cookie";
import { apiClient } from "@/lib/axios";
import axios from "axios";
import { LoginSchemaType } from "../schema/login.schema";

export const authApi = {
  login: async (data: LoginSchemaType) => {
    const response = await apiClient.post("/api/Auth/org/temp/action/Login", { 
        username: data.username, 
        password: data.password 
    });

    const { status, message, token } = response.data;

    if (status === "Success" || status === "OK") {
        const accessToken = token?.access_token;
        // 🔥 1. ดึง Refresh Token ออกมา (ปกติ Onix จะส่งมาคู่กัน)
        const refreshToken = token?.refresh_token; 

        if (accessToken) {
            // Set Access Token (อายุสั้น เช่น 1 วัน)
            Cookies.set("auth_token", accessToken, { expires: 1 });
            
            // 🔥 2. Set Refresh Token (อายุนานกว่า เช่น 7 วัน)
            // ตัวนี้สำคัญมาก! ถ้าไม่มีตัวนี้ Axios Interceptor จะไม่สามารถ Auto-Refresh ได้
            if (refreshToken) {
                Cookies.set("refresh_token", refreshToken, { expires: 7 });
            }
            
            // Manual Header Set (เพื่อให้ API ถัดไปใช้ได้ทันที)
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            if (token?.userName) {
                localStorage.setItem("user_info", JSON.stringify({ username: token.userName }));
            }
            return response.data;
        } else {
            throw new Error("No access_token found");
        }
    } else {
        throw new Error(message || "Login failed");
    }
  },

  getAllowedOrg: async (accessToken?: string) => {
    const config = accessToken 
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : {};

    // ใช้ URL นี้ตามที่คุณยืนยันมาล่าสุด
    const response = await apiClient.get("/api/OnlyUser/org/temp/action/GetUserAllowedOrg", config); 
    return response.data; 
  },

  logout: {
    api: async (orgId: string | null = null) => {
       const targetOrg = orgId || localStorage.getItem("current_org") || "temp";
       return apiClient.post(`/api/OnlyUser/org/${targetOrg}/action/Logout`);
    },
    clearCookies: async () => {
       // ลบ Header
       delete apiClient.defaults.headers.common['Authorization'];
       
       // ลบ Cookie ฝั่ง Client ด้วยเพื่อความชัวร์ (นอกเหนือจากที่ View ทำ)
       Cookies.remove("auth_token");
       Cookies.remove("refresh_token"); // 🔥 ลบ Refresh Token ด้วย
       
       return axios.post("/api/auth/logout");
    }
  }
};