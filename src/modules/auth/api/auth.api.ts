// src/modules/auth/api/auth.api.ts
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
        if (accessToken) {
            Cookies.set("auth_token", accessToken, { expires: 1 });
            
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

    const response = await apiClient.get("/api/OnlyUser/org/temp/action/GetUserAllowedOrg", config); 
    return response.data; 
  },

  logout: {
    api: async (orgId: string | null = null) => {
       const targetOrg = orgId || localStorage.getItem("current_org") || "temp";
       return apiClient.post(`/api/OnlyUser/org/${targetOrg}/action/Logout`);
    },
    clearCookies: async () => {
       delete apiClient.defaults.headers.common['Authorization'];
       return axios.post("/api/auth/logout");
    }
  }
};