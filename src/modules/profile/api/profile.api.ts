import Cookies from "js-cookie";
import { apiClient } from "@/lib/axios"; 

const toBase64 = (str: string) => {
  try { return btoa(unescape(encodeURIComponent(str))); } catch { return str; }
};

export const profileApi = {
  getUserByUserName: async (username: string) => {
    const orgId = localStorage.getItem("current_org") || "default";

    return apiClient.get(`/api/OnlyUser/org/${orgId}/action/GetUserByUserName/${username}`, {
      headers: { Authorization: `Bearer ${toBase64(Cookies.get("auth_token") || "")}` }
    });
  },

  updateProfile: async (formData: any) => {
    const token = Cookies.get("auth_token") || "";
    const orgId = localStorage.getItem("current_org") || "default";

    let username = "";
    let userId = ""; 
    try {
        const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
        username = payload.preferred_username || "";
        userId = payload.sub || payload.id || payload.userId || ""; 
    } catch (e) { console.error(e); }

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
      },
      { headers: { Authorization: `Bearer ${toBase64(token)}` } }
    );
  },

  changePassword: async (passData: any) => {
    const token = Cookies.get("auth_token") || "";
    const orgId = localStorage.getItem("current_org") || "default";

    let username = "";
    try {
        const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
        username = payload.preferred_username || "";
    } catch (e) { console.error(e); }

    return apiClient.post(`/api/OnlyUser/org/${orgId}/action/UpdatePassword`, 
      {
        userName: username,
        currentPassword: passData.oldPassword, 
        newPassword: passData.newPassword
      },
      { headers: { Authorization: `Bearer ${toBase64(token)}` } }
    );
  }
};