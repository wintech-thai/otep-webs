import { apiClient } from "@/lib/axios";

// --- Interfaces ---

export interface IPermission {
  permissionId: string;
  permissionName: string;
  permissionGroup: string;
  description?: string;
  isSelected?: boolean; 
}

// ✅ อัปเดต Interface ให้ตรงกับ API Response จริง
export interface ICustomRole {
  roleId: string;           // API ส่งมาเป็น roleId ไม่ใช่ customRoleId
  orgId: string;
  roleName: string;
  roleDescription?: string | null;
  roleDefinition?: string;
  roleCreatedDate?: string;
  permissions?: IPermission[]; 
  tags?: string | null;     // API ส่งมาเป็น null หรือ string
}

export interface CreateCustomRolePayload {
  roleName: string;
  roleDescription?: string;
  permissionIds: string[]; 
  tags?: string; // เพิ่ม tags เผื่อไว้สำหรับการสร้าง
}

// --- API Service ---
export const customRoleApi = {
  
  getCustomRoles: async (params: {
    orgId: string;
    offset?: number; 
    limit?: number;
    fullTextSearch?: string;
  }) => {
    return apiClient.post<ICustomRole[]>(
      `/api/CustomRole/org/${params.orgId}/action/GetCustomRoles`, 
      { 
        limit: params.limit ?? 100, 
        offset: params.offset ?? 0,
        fullTextSearch: params.fullTextSearch ?? "",
        level: null,      
        fromDate: null,   
        toDate: null      
      }
    );
  },

  getCustomRoleCount: async (params: {
    orgId: string;
    fullTextSearch?: string;
  }) => {
    return apiClient.post<number>(
      `/api/CustomRole/org/${params.orgId}/action/GetCustomRoleCount`,
      {
        fullTextSearch: params.fullTextSearch ?? "",
        fromDate: null,
        toDate: null
      }
    );
  },

  getCustomRoleById: async (orgId: string, roleId: string) => {
    return apiClient.get<ICustomRole>(
      `/api/CustomRole/org/${orgId}/action/GetCustomRoleById/${roleId}`
    );
  },

  addCustomRole: async (orgId: string, data: CreateCustomRolePayload) => {
    return apiClient.post(
      `/api/CustomRole/org/${orgId}/action/AddCustomRole`,
      data
    );
  },

  updateCustomRole: async (orgId: string, roleId: string, data: CreateCustomRolePayload) => {
    return apiClient.post(
      `/api/CustomRole/org/${orgId}/action/UpdateCustomRoleById/${roleId}`,
      data
    );
  },

  deleteCustomRole: async (orgId: string, roleId: string) => {
    return apiClient.delete(
      `/api/CustomRole/org/${orgId}/action/DeleteCustomRoleById/${roleId}`
    );
  },

  getInitialPermissions: async (orgId: string) => {
    return apiClient.get<IPermission[]>(
      `/api/CustomRole/org/${orgId}/action/GetInitialUserRolePermissions`
    );
  }
};