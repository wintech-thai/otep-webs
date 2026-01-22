import Cookies from "js-cookie";
import { apiClient } from "@/lib/axios"; 

const getUserInfoFromToken = () => {
  const token = Cookies.get("auth_token") || "";
  try {
    if (!token) return { username: "", userId: "" };
    const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
    return {
      username: payload.preferred_username || "",
      userId: payload.sub || payload.id || payload.userId || ""
    };
  } catch (e) {
    console.error("Error parsing token:", e);
    return { username: "", userId: "" };
  }
};

export const profileApi = {
  getUserByUserName: async (username: string) => {
    const orgId = localStorage.getItem("current_org") || "default";

    return apiClient.get(`/api/OnlyUser/org/${orgId}/action/GetUserByUserName/${username}`);
  },

  updateProfile: async (formData: any) => {
    const orgId = localStorage.getItem("current_org") || "default";
    const { username, userId } = getUserInfoFromToken();

    const formattedPhone = formData.phoneNumber?.startsWith("0") 
        ? "+66" + formData.phoneNumber.substring(1) 
        : formData.phoneNumber;

    return apiClient.post(`/api/OnlyUser/org/${orgId}/action/UpdateUserByUserName/${username}`, 
      {
        userId,
        userName: username,
        userEmail: formData.email,
        name: formData.firstName,         
        lastName: formData.lastName,
        phoneNumber: formattedPhone, 
        secondaryEmail: formData.secondaryEmail,
      }
    );
  },

  changePassword: async (passData: any) => {
    const orgId = localStorage.getItem("current_org") || "default";
    const { username } = getUserInfoFromToken();

    return apiClient.post(`/api/OnlyUser/org/${orgId}/action/UpdatePassword`, 
      {
        userName: username,
        currentPassword: passData.oldPassword, 
        newPassword: passData.newPassword
      }
    );
  }
};