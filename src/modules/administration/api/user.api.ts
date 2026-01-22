import { apiClient } from "@/lib/axios";
import { UserSchemaType } from "../schema/user.schema";

// --- Types ---
export interface IUser {
  orgUserId: string;
  userId: string;
  userName: string;
  userEmail: string | null;
  tmpUserEmail: string | null;
  userStatus: string;
  roles: string[]; 
  rolesList: string; 
  tags: string | null;
  createdDate: string;
  customRoleId: string | null;
  customRoleName: string | null;
  isOrgInitialUser: string | null;
}

export interface IUserRole {
  roleId: string;
  roleName: string;
  roleDescription: string;
  roleDefinition?: string;
}

export interface InviteUserResponse {
  status: string;
  description: string;
  registrationUrl?: string; 
  RegistrationUrl?: string; 
}

// --- API Service ---
export const userApi = {
  getUsers: async (params: {
    orgId: string;
    offset: number;
    limit: number;
    fullTextSearch?: string;
    fromDate?: string;
    toDate?: string;
  }) => {
    return apiClient.post<IUser[]>(
      `/api/OrganizationUser/org/${params.orgId}/action/GetUsers`,
      params
    );
  },

  getUserCount: async (params: {
    orgId: string;
    fullTextSearch?: string;
    fromDate?: string;
    toDate?: string;
  }) => {
    return apiClient.post<number>(
      `/api/OrganizationUser/org/${params.orgId}/action/GetUserCount`,
      params
    );
  },

  getAvailableRoles: async (orgId: string) => {
    return new Promise((resolve) => {
      resolve([
        { roleId: "OWNER", roleName: "OWNER", roleDescription: "Organization Owner" },
        { roleId: "EDITOR", roleName: "EDITOR", roleDescription: "Organization Editor" },
        { roleId: "UPLOADER", roleName: "UPLOADER", roleDescription: "Organization File Uploader" },
        { roleId: "VIEWER", roleName: "VIEWER", roleDescription: "Organization Viewer" }
      ] as IUserRole[]);
    });
  },

  inviteUser: async (orgId: string, data: UserSchemaType) => {
    return apiClient.post<InviteUserResponse>(
      `/api/OrganizationUser/org/${orgId}/action/InviteUser`,
      data
    );
  },

  updateUser: async (orgId: string, userId: string, data: UserSchemaType) => {
    return apiClient.post(
      `/api/OrganizationUser/org/${orgId}/action/UpdateUser`,
      { ...data, userId }
    );
  },

  deleteUser: async (orgId: string, userId: string) => {
    return apiClient.delete(
      `/api/OrganizationUser/org/${orgId}/action/DeleteUserById/${userId}`
    );
  },

  enableUser: async (orgId: string, userId: string) => {
    return apiClient.post(
      `/api/OrganizationUser/org/${orgId}/action/EnableUserById/${userId}`
    );
  },

  disableUser: async (orgId: string, userId: string) => {
    return apiClient.post(
      `/api/OrganizationUser/org/${orgId}/action/DisableUserById/${userId}`
    );
  },
  
  getUserById: async (orgId: string, userId: string) => {
    return apiClient.get<IUser>(
      `/api/OrganizationUser/org/${orgId}/action/GetUserById/${userId}`
    );
  }
};