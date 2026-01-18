// src/modules/auth/api/auth.api.ts
import Cookies from "js-cookie";
import { apiClient } from "@/lib/axios";
import { LoginSchemaType } from "../schema/login.schema";

export const authApi = {
  login: async (data: LoginSchemaType) => {
    const response = await apiClient.post("/api/Auth/org/temp/action/Login", { 
        username: data.username, 
        password: data.password 
    });

    console.log("🔥 SERVER RESPONSE:", response.data); 
    const { status, message, token } = response.data;

    if (status === "Success" || status === "OK") {
        
        const accessToken = token?.access_token;

        if (accessToken) {
            Cookies.set("auth_token", accessToken, { expires: 1 });
            
            if (token?.userName) {
                localStorage.setItem("user_info", JSON.stringify({ username: token.userName }));
            }

            return response.data;
        } else {
            throw new Error("Login success but no access_token found.");
        }

    } else {
        throw new Error(message || "Login failed");
    }
  },

  logout: () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("user_info");
    window.location.href = "/login";
  }
};