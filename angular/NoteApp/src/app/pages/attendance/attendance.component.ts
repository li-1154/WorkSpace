import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { AttendanceRecord } from 'src/app/models/attendance.model';
import { promise } from 'protractor';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class AttendanceComponent implements OnInit {
  // ========== 通用状态 ==========
  currentDate = '';
  currentTime = '';
  timer: any;
  isHoliday = false;
  holidayName = '';
  datecolor = false;
  datecolorweekcheck = false;

  // ========== 页面结构 ==========
  currentTab: 'personal' | 'group' = 'personal';

  // ========== 出勤相关 ==========
  todayRecord: AttendanceRecord | null = null;
  isSubmitting = false;
  isLoadingRecord = true; // ✅ 新增：加载中状态，刷新时按钮先禁用

  // ========== 用户资料 ==========
  userName: string | null = null;
  userGroup: string | null = null;
  groupAccessDenied = false; // 控制组员页显示

  constructor(private attendanceService: AttendanceService, private afs: AngularFirestore) { }

  async ngOnInit(): Promise<void> {
    // 1️⃣ 日期时间
    this.updateDateTime();
    this.timer = setInterval(() => this.updateDateTime(), 1000);

    // 2️⃣ 检查组员访问权限（决定是否能进组员页）
    await this.checkGroupAccess();

    // 3️⃣ 检查假日 + 出勤记录（仅个人页）
    await this.checkHoliday();
    await this.checkHolidayOrWeekend();
    await this.loadTodayRecord();

    if (!this.groupAccessDenied) {
      await this.loadGroupAttendance();
    }
  }

  // ==============================
  // ✅ 检查用户 name / group
  // ==============================
  async checkGroupAccess() {
    const userData = await this.attendanceService.getUserInfo();
    if (!userData) {
      this.groupAccessDenied = true;
      return;
    }

    this.userName = userData.name;
    this.userGroup = userData.group;

    if (
      !this.userName ||
      this.userName === '未設定' ||
      !this.userGroup ||
      this.userGroup === '未設定'
    ) {
      this.groupAccessDenied = true;
    } else {
      this.groupAccessDenied = false;
    }
  }

  // ==============================
  // ✅ 时间与日期
  // ==============================
  updateDateTime() {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    this.currentDate = `${now.getMonth() + 1}月${now.getDate()}日(${days[now.getDay()]})`;
    this.currentTime = now.toLocaleTimeString('ja-JP', { hour12: false });
  }

  // ==============================
  // ✅ 祝日 / 周末判断
  // ==============================
  async checkHoliday() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    try {
      const res = await fetch(
        `https://holidays-jp.github.io/api/v1/${today.getFullYear()}/date.json`
      );
      const data = await res.json();
      if (data[dateStr]) {
        this.isHoliday = true;
        this.datecolor = true;
        this.holidayName = data[dateStr];
      } else {
        this.isHoliday = false;
      }
    } catch (err) {
      console.error('祝日チェック失敗', err);
    }
  }

  async checkHolidayOrWeekend() {
    const now = new Date();
    const day = now.getDay();
    if (day === 0 || day === 6) this.datecolor = true;
  }

  // ==============================
  // ✅ 出勤逻辑
  // ==============================
  weekendWork() {
    this.datecolorweekcheck = !this.datecolorweekcheck;
  }

  async onAttend(type: string) {
    // 防止重复操作或刷新后误触
    if (this.isLoadingRecord || this.isSubmitting) return;

    this.isSubmitting = true;

    const result = await this.attendanceService.logAttendance(type);
    if (result?.success) {
      await this.loadTodayRecord();
    } else {
      alert('❌ 打卡失败，请重试');
    }

    this.isSubmitting = false;
  }

  async loadTodayRecord() {
    this.isLoadingRecord = true; // ⏳开始加载（刷新后按钮禁用）

    this.todayRecord = await this.attendanceService.getTodayRecord();

    this.isLoadingRecord = false; // ✅ 数据到位后恢复按钮状态
  }

  isDisabled(type: string): boolean {
    const r = this.todayRecord;
    if (!r) return false;
    switch (type) {
      case '出勤': return !!r.checkIn;
      case '中途退勤': return !!r.breakOut;
      case '中途出勤': return !!r.breakIn;
      case '退勤': return !!r.checkOut;
      default: return false;
    }
  }

  getWorkDuration(): string | null {
    if (!this.todayRecord?.checkIn || !this.todayRecord?.checkOut) return null;
    const [inH, inM, inS] = this.todayRecord.checkIn.split(':').map(Number);
    const [outH, outM, outS] = this.todayRecord.checkOut.split(':').map(Number);
    const checkIn = new Date(); checkIn.setHours(inH, inM, inS, 0);
    const checkOut = new Date(); checkOut.setHours(outH, outM, outS, 0);
    const diff = checkOut.getTime() - checkIn.getTime();
    if (diff <= 0) return null;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}小时 ${m}分`;
  }

  groupMembers: { name: string; status: '出勤中' | '已退勤' | '未出勤'; checkIn?: string; checkOut?: string }[] = [];
  isLoadingGroup = false;


  async loadGroupAttendance() {
    if (!this.userGroup) return;
    this.isLoadingGroup = true;
    
    
    const today = new Date();
    const todayStr =
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const snap = await this.afs.collection('attendancd', ref => ref.where('group', '==', this.userGroup).where('date', '==', todayStr)).get().toPromise();

    this.groupMembers = snap.docs.map(d => {
      const a: any = d.data();
      let status: '出勤中' | '已退勤' = '出勤中';
      if (a.checkOut) status = '已退勤';
      return {
        name: a.name,
        status: status,
        checkIn: a.checkIn ?? null,
        checkOut: a.checkOut ?? null
      };
    });
    this.isLoadingGroup = false;
  }

 
}



