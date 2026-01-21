import Cookies from "js-cookie";
import { apiClient } from "@/lib/axios";
import axios from "axios";
import { LoginSchemaType } from "../schema/login.schema";

const toBase64 = (str: string) => {
  if (!str) return "";
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (err) {
    return str;
  }
};

export const authApi = {
  login: async (data: LoginSchemaType) => {
    const response = await apiClient.post("/api/Auth/org/temp/action/Login", { 
        username: data.username, 
        password: data.password 
    });

    const { status, message, token } = response.data;

    if (status === "Success" || status === "OK") {
        const accessToken = token?.access_token;
        const refreshToken = token?.refresh_token; 

        if (accessToken) {
            Cookies.set("auth_token", accessToken, { expires: 1 });
            
            if (refreshToken) {
                Cookies.set("refresh_token", refreshToken, { expires: 7 });
            }
            
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
    const token = accessToken || Cookies.get("auth_token");

    const config = token 
      ? { headers: { Authorization: `Bearer ${toBase64(token)}` } }
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
       
       Cookies.remove("auth_token");
       Cookies.remove("refresh_token");
       
       return axios.post("/api/auth/logout");
    }
  }
};