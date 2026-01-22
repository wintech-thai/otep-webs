import { apiClient } from "@/lib/axios";

export interface ICustomRole {
  customRoleId: string;
  roleName: string;
  roleDescription?: string;
}

export const customRoleApi = {
  getCustomRoles: async (orgId: string) => {
    return apiClient.post<ICustomRole[]>(
      `/api/CustomRole/org/${orgId}/action/GetCustomRoles`,
      { 
        limit: 100, 
        offset: 0,
        fullTextSearch: "",
        level: null,      // 👈 ลองส่ง null หรือลองใส่เลข 0 ดูครับ
        fromDate: null,   // 👈 วันที่ส่ง null จะปลอดภัยกว่า ""
        toDate: null      // 👈 วันที่ส่ง null จะปลอดภัยกว่า ""
      }
    );
  }
};