import { apiClient } from "@/lib/axios";
import { LoginSchemaType } from "../schema/login.schema";

export const authApi = {
  login: async (data: LoginSchemaType) => {
    return apiClient.post("/api/auth/login", { 
        username: data.username, 
        password: data.password 
    });
  },
};