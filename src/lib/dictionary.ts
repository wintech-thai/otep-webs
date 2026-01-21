export type Language = "EN" | "TH";

export const dictionary = {
  EN: {
    // --- Layout (Sidebar & Header) ---
    appTitle: "OTEP Console",
    subTitle: "Control Panel",
    dashboard: "Dashboard",
    administration: "Administration",
    customRole: "Custom Role",
    apiKeys: "API Keys",
    users: "Users",
    auditLog: "Audit Log",
    languageName: "English",
    languageSub: "US",
    version: "version: v2.0.0-otep",
    copyright: "© 2026 OTEP.",
    comingSoon: "Coming Soon",
    
    // --- Dashboard ---
    overview: "Overview",
    welcomeMessage: "Welcome back to OTEP Control Panel.",
    statTotalUsers: "Total Users",
    statActiveSessions: "Active Sessions",
    statAuditLogs: "Audit Logs",

    // --- Common (ใช้ร่วมกันทุกหน้า) ---
    fullTextSearch: "Full Text Search",
    search: "Search",
    add: "ADD",
    delete: "DELETE",
    rowsPerPage: "Rows per page",
    action: "Action",
    status: "Status",
    description: "Description",
    tags: "Tags",
    role: "Role",
    
    // เพิ่มส่วน Common Buttons
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    loading: "Loading...",

    // --- Custom Role Page ---
    roleName: "Role Name",
    searchRolePlaceholder: "Search role permissions...",

    // --- API Keys Page ---
    keyName: "Key Name",
    customRoleTh: "Custom Role",
    rolesTh: "Roles",
    searchApiKeyPlaceholder: "Search API keys...",

    // --- Users Page ---
    username: "Username",
    email: "Email",
    initialUser: "Initial User",
    searchUserPlaceholder: "Search users...",

    // --- Audit Log Page ---
    time: "Time",
    idType: "Id Type",
    api: "API",
    ipAddress: "IP Address",
    searchValuePlaceholder: "Search Value",
    dateRangePlaceholder: "Select Date Range",

    changePasswordTitle: "Change Password",
    changePasswordDesc: "Please update your password to continue.",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    msgPasswordSuccess: "Password changed successfully",
    msgPasswordError: "Failed to change password",
    descChangePassword: "Please update your password to continue.", 

    updateProfileTitle: "Update Profile",
    firstName: "First Name",
    lastName: "Last Name",
    phoneNumber: "Phone Number",
    secondaryEmail: "Secondary Email",
    msgProfileSuccess: "Profile updated successfully",
    msgProfileError: "Failed to save profile data",
    
    // Placeholders
    phFirstName: "First Name",
    phLastName: "Last Name",
    phPhone: "e.g. 66812345678",
    phSecondaryEmail: "Backup Email (Optional)",

    menuProfile: "Profile",
    menuLogout: "Logout",
  },
  TH: {
    // --- Layout (Sidebar & Header) ---
    appTitle: "OTEP Console",
    subTitle: "แผงควบคุม",
    dashboard: "แดชบอร์ด",
    administration: "การจัดการระบบ",
    customRole: "สิทธิ์ตามบทบาท",
    apiKeys: "กุญแจ API",
    users: "ผู้ใช้",
    auditLog: "ตรวจสอบการใช้งาน",
    languageName: "ภาษาไทย",
    languageSub: "TH",
    version: "เวอร์ชัน: v2.0.0-otep",
    copyright: "© 2569 OTEP.",
    comingSoon: "เร็วๆ นี้",

    // --- Dashboard ---
    overview: "ภาพรวมระบบ",
    welcomeMessage: "ยินดีต้อนรับกลับสู่แผงควบคุม OTEP",
    statTotalUsers: "ผู้ใช้งานทั้งหมด",
    statActiveSessions: "เซสชันที่ใช้งานอยู่",
    statAuditLogs: "รายการ Audit Log",

    // --- Common ---
    fullTextSearch: "ค้นหาแบบเต็ม",
    search: "ค้นหา",
    add: "เพิ่ม",
    delete: "ลบ",
    rowsPerPage: "จำนวนแถวต่อหน้า",
    action: "จัดการ",
    status: "สถานะ",
    description: "คำอธิบาย",
    tags: "แท็ก",
    role: "บทบาท",

    // Common Buttons
    save: "บันทึก",
    cancel: "ยกเลิก",
    confirm: "ยืนยัน",
    loading: "กำลังโหลด...",

    // --- Custom Role Page ---
    roleName: "ชื่อบทบาท",
    searchRolePlaceholder: "ค้นหาสิทธิ์การใช้งาน...",

    // --- API Keys Page ---
    keyName: "ชื่อคีย์",
    customRoleTh: "สิทธิ์กำหนดเอง",
    rolesTh: "บทบาท",
    searchApiKeyPlaceholder: "ค้นหาคีย์ API...",

    // --- Users Page ---
    username: "ชื่อผู้ใช้",
    email: "อีเมล",
    initialUser: "ผู้ใช้เริ่มต้น",
    searchUserPlaceholder: "ค้นหาผู้ใช้งาน...",

    // --- Audit Log Page ---
    time: "เวลา",
    idType: "ประเภท ID",
    api: "API",
    ipAddress: "ที่อยู่ IP",
    searchValuePlaceholder: "ค้นหาค่า...",
    dateRangePlaceholder: "เลือกช่วงเวลา",

    changePasswordTitle: "เปลี่ยนรหัสผ่าน",
    changePasswordDesc: "กรุณากรอกรหัสผ่านใหม่เพื่อดำเนินการต่อ",
    currentPassword: "รหัสผ่านปัจจุบัน",
    newPassword: "รหัสผ่านใหม่",
    confirmPassword: "ยืนยันรหัสผ่านใหม่",
    msgPasswordSuccess: "เปลี่ยนรหัสผ่านสำเร็จ",
    msgPasswordError: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
    descChangePassword: "กรุณากรอกรหัสผ่านใหม่เพื่อดำเนินการต่อ",

    updateProfileTitle: "แก้ไขข้อมูลส่วนตัว",
    firstName: "ชื่อจริง",
    lastName: "นามสกุล",
    phoneNumber: "เบอร์โทรศัพท์",
    secondaryEmail: "อีเมลสำรอง",
    msgProfileSuccess: "บันทึกข้อมูลสำเร็จ",
    msgProfileError: "บันทึกข้อมูลไม่สำเร็จ",

    // Placeholders
    phFirstName: "ชื่อจริง",
    phLastName: "นามสกุล",
    phPhone: "เช่น 66812345678",
    phSecondaryEmail: "อีเมลสำรอง (ถ้ามี)",

    menuProfile: "ข้อมูลส่วนตัว",
    menuLogout: "ออกจากระบบ",
  }
};