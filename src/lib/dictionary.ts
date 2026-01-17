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
    role: "Role", // Common for Users & Audit Log

    // --- Custom Role Page ---
    roleName: "Role Name",
    searchRolePlaceholder: "Search role permissions...",

    // --- API Keys Page ---
    keyName: "Key Name",
    customRoleTh: "Custom Role", // ชื่อหัวตาราง
    rolesTh: "Roles", // ชื่อหัวตาราง
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

    // --- Common (ใช้ร่วมกันทุกหน้า) ---
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
  }
};