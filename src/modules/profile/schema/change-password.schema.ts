import * as z from "zod";

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(7, "Password must be 7-15 characters")
    .max(15, "Password must be 7-15 characters")
    .regex(/[a-z]/, "At least 1 lowercase letter required")
    .regex(/[A-Z]/, "At least 1 uppercase letter required")
    .regex(/[#!@]/, "At least 1 special character required (#, !, @)"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// 🔥🔥🔥 เพิ่มบรรทัดนี้ครับ 🔥🔥🔥
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;