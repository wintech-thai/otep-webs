import { apiClient } from "@/lib/axios";
import Cookies from "js-cookie";

// 🛠️ Helper: แปลง Text เป็น Base64 (ไม่ต้องตัด = ออก เพื่อให้ Backend .NET อ่านได้)
const toBase64 = (str: string) => {
  if (!str) return "";
  try {
    return btoa(str); 
  } catch (err) {
    return str;
  }
};

// Helper: แกะ ID จาก Token (sub)
const getUserIdFromToken = () => {
    const token = Cookies.get("auth_token");
    if (!token) return "";
    try {
        // บางที JWT เป็น Base64Url ต้องแปลง - เป็น + และ _ เป็น / ก่อน
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload.sub || ""; 
    } catch (e) {
        return "";
    }
};

// Helper: ดึงข้อมูลจาก LocalStorage
const getUserInfo = () => {
  if (typeof window === "undefined") return {};
  try {
    const userStr = localStorage.getItem("user_info");
    return JSON.parse(userStr || "{}");
  } catch (error) {
    return {};
  }
};

const getCurrentOrg = () => {
  if (typeof window === "undefined") return "temp"; 
  const org = localStorage.getItem("current_org");
  if (!org || org === "default") return "temp";
  return org;
};

export const profileApi = {
  
  // Update Profile
  updateProfile: async (formData: any) => {
    const userInfo = getUserInfo();
    const rawUsername = userInfo.userName || userInfo.username || "";
    const rawEmail = userInfo.email || "";
    const rawOrgId = getCurrentOrg();
    
    const userId = getUserIdFromToken();

    const encodedOrg = toBase64(rawOrgId);
    const encodedUser = toBase64(rawUsername);

    console.log(`🚀 Updating Profile...`);
    console.log(`ID: ${userId}, User: ${rawUsername}, Org: ${rawOrgId}`);

    const payload = {
        userId: userId,              
        userName: rawUsername,
        userEmail: rawEmail,
        
        name: formData.firstName,    
        lastName: formData.lastName,
        
        phoneNumber: formData.phoneNumber,
        secondaryEmail: formData.secondaryEmail,
        
        phoneNumberVerified: false,      
        secondaryEmailVerified: false,   
        isOrgInitialUser: false          
    };

    return apiClient.post(
        `/api/OnlyUser/org/${encodedOrg}/action/UpdateUserByUserName/${encodedUser}`, 
        payload
    );
  },

  // Change Password
  changePassword: async (data: any) => {
    const userInfo = getUserInfo();
    const rawUsername = userInfo.userName || userInfo.username || "";
    const rawOrgId = getCurrentOrg();
    
    const encodedOrg = toBase64(rawOrgId);

    return apiClient.post(`/api/OnlyUser/org/${encodedOrg}/action/UpdatePassword`, {
        username: rawUsername,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.newPassword
    });
  }
};