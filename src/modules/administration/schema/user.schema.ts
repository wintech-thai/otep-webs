import { z } from "zod";

export const userSchema = z.object({
  userId: z.string().optional(),
  
  userName: z
    .string()
    .min(1, { message: "Username is required" })
    .min(4, { message: "Username must be at least 4 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),
  
  tmpUserEmail: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(80, { message: "Email must be at most 80 characters" }),
    
  tags: z
    .string()
    .min(1, { message: "At least one tag is required" }),
  
  roles: z.array(z.string()),
  
  customRoleId: z.string().nullable().optional(),
  customRoleName: z.string().nullable().optional(),
  customRoleDesc: z.string().nullable().optional(),

  // ✅✅ เพิ่มบรรทัดนี้ครับ! เพื่อให้ระบบรู้จักฟิลด์นี้
  userStatus: z.string().optional(),
});

export type UserSchemaType = z.infer<typeof userSchema>;