import { z } from "zod";

export const customRoleSchema = z.object({
  roleName: z.string().min(1, "Role name is required"),
  roleDescription: z.string().min(1, "Description is required"),
  tags: z.string().min(1, "At least one tag is required"), 
  permissionIds: z.array(z.string()), 
});

export type CustomRoleSchemaType = z.infer<typeof customRoleSchema>;