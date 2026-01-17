import Cookies from "js-cookie";
import { apiClient } from "@/lib/axios";
import { LoginSchemaType } from "../schema/login.schema";

export const authApi = {
  login: async (data: LoginSchemaType) => {
    const response = await apiClient.post("/api/Auth/org/temp/action/Login", { 
        username: data.username, 
        password: data.password 
    });
    console.log("🔥 API Response:", response.data);

    // (API อาจตอบ 200 แต่ Status เป็น Error)
    const { Status, Data, Message } = response.data;

    if (Status === "OK" || Status === "Success") {
        const token = Data?.token || Data?.access_token;
        
        if (token) {
            // 3. บันทึก Cookie 
            Cookies.set("auth_token", token, { expires: 1 });
            
            if (Data?.user) {
                localStorage.setItem("user_info", JSON.stringify(Data.user));
            }

            return response.data;
        } else {
            throw new Error("Token not found in response");
        }
    } else {
        throw new Error(Message || "Login failed");
    }
  },

  logout: () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("user_info");
    window.location.href = "/login";
  }
};