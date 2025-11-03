export interface AttendanceRecord {
  uid: string;        // 用户 UID
  name: string;       // 用户姓名
  group: string;      // 小组
  date: string;       // 日期 (YYYY-MM-DD)
  checkIn?: string;   // 出勤时间
  breakOut?: string;  // 中途退勤时间
  breakIn?: string;   // 中途出勤时间
  checkOut?: string;  // 退勤时间
  status:number;//✅ 新增字段：出勤状态 0~4
  createdAt: any;     // 创建时间（Firestore Timestamp）
  updatedAt?: any;    // 更新时间
}
