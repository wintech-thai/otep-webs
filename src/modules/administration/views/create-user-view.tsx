"use client";

import { UserForm } from "../components/user-form";

export default function CreateUserView() {
  return (
    // ✅ เปลี่ยนจาก max-w-7xl เป็น w-full เพื่อให้ยืดเต็มพื้นที่ Layout หลัก
    // ✅ และเอา mx-auto ออก (หรือคงไว้ก็ได้ถ้าเป็น w-full)
    <div className="w-full h-full py-4">
      <UserForm />
    </div>
  );
}