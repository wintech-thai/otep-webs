import axios from "axios";
import Cookies from "js-cookie";

const client = axios.create({
  baseURL: "/api-proxy", 
  headers: { "Content-Type": "application/json" },
  timeout: 30000 
});

export const profileApi = {
  // 1. ดึงข้อมูลจาก Database
  getUserByUserName: async (username: string) => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No Token");
    const encodedToken = btoa(token);

    const orgId = localStorage.getItem("current_org") || "default";

    return client.get(
      `/api/OnlyUser/org/${orgId}/action/GetUserByUserName/${username}`,
      {
        headers: { Authorization: `Bearer ${encodedToken}` }
      }
    );
  },

  // 2. อัปเดตข้อมูลโปรไฟล์
  updateProfile: async (formData: any) => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No Token");
    const encodedToken = btoa(token);

    let username = "";
    let userId = ""; 
    try {
        const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
        username = payload.preferred_username || "";
        userId = payload.sub || payload.id || payload.userId || ""; 
    } catch (e) { console.error(e); }

    // แปลงเบอร์เป็น +66
    let formattedPhone = formData.phoneNumber;
    if (formattedPhone && formattedPhone.startsWith("0")) {
        formattedPhone = "+66" + formattedPhone.substring(1);
    }

    const orgId = localStorage.getItem("current_org") || "default";

    return client.post(
      `/api/OnlyUser/org/${orgId}/action/UpdateUserByUserName/${username}`,
      {
        userId: userId,
        userName: username,
        userEmail: formData.email,
        name: formData.firstName,         
        lastName: formData.lastName,
        phoneNumber: formattedPhone, 
        secondaryEmail: formData.secondaryEmail,
      },
      { headers: { Authorization: `Bearer ${encodedToken}` } }
    );
  },

  // 3. เปลี่ยนรหัสผ่าน (แก้ไข: ส่งเป็นข้อความปกติ ไม่ใช้ btoa)
  changePassword: async (passData: any) => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No Token");
    
    // Authorization Token ยังต้อง btoa เหมือนเดิมตามกฎ API
    const encodedToken = btoa(token);
    
    let username = "";
    try {
        const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
        username = payload.preferred_username || "";
    } catch (e) { console.error(e); }

    const orgId = localStorage.getItem("current_org") || "default";

    return client.post(
      `/api/OnlyUser/org/${orgId}/action/UpdatePassword`,
      {
        userName: username,
        // ✅ ส่งรหัสผ่านเป็น Raw String เพื่อไม่ให้ความยาวเกิน 15 ตัวอักษร
        currentPassword: passData.oldPassword, 
        newPassword: passData.newPassword
      },
      { headers: { Authorization: `Bearer ${encodedToken}` } }
    );
  }
};