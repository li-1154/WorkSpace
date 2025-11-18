import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { AttendanceRecord } from 'src/app/models/attendance.model';
import { ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class AttendanceComponent implements OnInit {
  // ==============================
  // 🕓 通用状态（日期、时间、假日）
  // ==============================
  currentDate = ''; // 当前日期（格式：5月12日(月)）
  currentTime = ''; // 当前时间（格式：14:05:12）
  timer: any; // 用于 setInterval 的计时器
  isHoliday = false; // 是否为假日
  holidayName = ''; // 假日名称（如「憲法記念日」）
  datecolor = false; // 日期是否标红（假日或周末）
  datecolorweekcheck = false; // 周末出勤时手动标记用

  // ==============================
  // 📄 页面结构控制
  // ==============================
  currentTab: 'personal' | 'group' = 'personal'; // 当前显示的页签（个人 or 组别）

  // ==============================
  // 🧾 出勤记录相关
  // ==============================
  todayRecord: AttendanceRecord | null = null; // 今日出勤记录
  isSubmitting = false; // 是否正在打卡提交中（防止重复点击）
  isLoadingRecord = true; // 是否正在加载记录（页面初始时禁用按钮）

  // ==============================
  // 👤 用户资料
  // ==============================
  userName: string | null = null; // 当前用户名
  userGroup: string | null = null; // 当前用户所在组
  groupAccessDenied = false; // 是否拒绝访问组信息（未设置 name/group 时）

  // ==============================
  // 🔧 构造函数：依赖注入
  // ==============================
  constructor(
    private attendanceService: AttendanceService, // 出勤相关服务
    private cdr: ChangeDetectorRef, // 手动刷新模板检测用
    private afauth: AngularFireAuth // Firebase 认证服务，用于监听登录状态
  ) {}

  // Firebase 认证订阅对象（组件销毁时要取消订阅）
  private authSub: Subscription;

  // ==============================
  // 🚀 生命周期钩子：组件初始化
  // ==============================
  async ngOnInit(): Promise<void> {
    // 1️⃣ 初始化日期与时间显示
    this.updateDateTime();
    this.timer = setInterval(() => this.updateDateTime(), 1000); // 每秒更新时间

    // 2️⃣ 订阅 Firebase 用户状态（非常关键！）
    // 👉 这是刷新页面后能够重新加载数据的关键逻辑
    this.authSub = this.afauth.authState.subscribe(async (user) => {
      if (!user) {
        // 用户未登录时，限制组功能访问
        console.log('用户未登录！');
        this.groupAccessDenied = true;
        return;
      }

      // Firebase 恢复登录成功后执行初始化
      console.log('用户已登录！', user.email);
      await this.initializeAfterLogin();
    });
  }

  // ==============================
  // ✅ 登录后初始化逻辑（只在用户确认后执行）
  // ==============================
  private async initializeAfterLogin() {
    // 1️⃣ 检查用户信息（是否有 name 和 group）
    await this.checkGroupAccess();

    // 2️⃣ 加载当天出勤记录
    await this.loadTodayRecord();

    // 3️⃣ 检查是否为假日或周末
    await this.checkHoliday();
    await this.checkHolidayOrWeekend();

    // 4️⃣ 如果有 group 且允许访问，则加载组成员信息
    if (!this.groupAccessDenied && this.userGroup) {
      await this.loadGroupMembers();
    }
  }

  // ==============================
  // 🔐 检查用户 name / group 设置
  // ==============================
  async checkGroupAccess() {
    const userData = await this.attendanceService.getUserInfo(); // 从服务获取当前用户信息

    if (!userData) {
      this.groupAccessDenied = true;
      return;
    }

    this.userName = userData.name;
    this.userGroup = userData.group;

    // 如果 name 或 group 为空/未設定，则禁止访问组功能
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
  // 🕓 更新时间与日期显示
  // ==============================
  updateDateTime() {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    this.currentDate = `${now.getMonth() + 1}月${now.getDate()}日(${
      days[now.getDay()]
    })`;
    this.currentTime = now.toLocaleTimeString('ja-JP', { hour12: false });
  }

  // ==============================
  // 🎌 检查是否为日本假日
  // ==============================
  async checkHoliday() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    try {
      // 调用日本假日API（holidays-jp）
      const res = await fetch(
        `https://holidays-jp.github.io/api/v1/${today.getFullYear()}/date.json`
      );
      const data = await res.json();

      if (data[dateStr]) {
        // 若匹配到假日则标记
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

  // ==============================
  // 📅 检查是否为周末
  // ==============================
  async checkHolidayOrWeekend() {
    const now = new Date();
    const day = now.getDay();
    if (day === 0 || day === 6) this.datecolor = true; // 0:日曜, 6:土曜
  }

  // ==============================
  // ⚙️ 切换周末出勤颜色状态
  // ==============================
  weekendWork() {
    this.datecolorweekcheck = !this.datecolorweekcheck;
  }

  // ==============================
  // 🕐 打卡逻辑
  // ==============================
  async onAttend(type: string) {
    // 防止重复点击或数据未加载时操作
    if (this.isLoadingRecord || this.isSubmitting) return;

    this.isSubmitting = true; // 按钮禁用

    const result = await this.attendanceService.logAttendance(type);
    if (result?.success) {
      await this.loadTodayRecord(); // 打卡成功后刷新记录
    } else {
      alert('❌ 打卡失败，请重试');
    }

    this.isSubmitting = false;
  }

  // ==============================
  // 📋 加载当天出勤记录
  // ==============================
  async loadTodayRecord() {
    this.isLoadingRecord = true; // ⏳ 开始加载（防止误触）
    this.todayRecord = await this.attendanceService.getTodayRecord();
    this.isLoadingRecord = false; // ✅ 数据加载完毕
  }

  // ==============================
  // 🚫 判断按钮是否禁用
  // ==============================
  isDisabled(type: string): boolean {
    if (!this.todayRecord) return type !== '出勤'; // 没记录时只能“出勤”

    const r = this.todayRecord;
    const s = r.status ?? 0;

    // ====== 基本状态检查 ======
    const canClick = {
      出勤: [0],
      中途退勤: [1],
      中途出勤: [3],
      退勤: [1,2],
    };
    let allow = canClick[type]?.includes(s) ?? false;

     // === 附加防重复逻辑 ===
  switch (type) {
    case '出勤':
      if (r.checkIn) allow = false;
      break;
    case '中途退勤':
      // 已中途退勤、未中途出勤的情况，不再允许再次点击
      if (r.breakOut) allow = false;
      break;
    case '中途出勤':
      // 已中途出勤过，禁用
      if (r.breakIn) allow = false;
      break;
    case '退勤':
      if (r.checkOut) allow = false;
      break;
    }

    return !allow;
  }

  // ==============================
  // ⏱️ 计算工作时长
  // ==============================
  getWorkDuration(): string | null {
    return this.attendanceService.getWorkDuration(this.todayRecord);
}

  // ==============================
  // 👥 加载组员出勤信息
  // ==============================
  groupMembers: {
    name: string;
    checkIn?: string;
    breakOut?: string;
    breakIn?: string;
    checkOut?: string;
    workedHours?:string;
  }[] = [];

  async loadGroupMembers() {
    if (!this.userGroup) {
      console.warn('⛔ 未设置用户 group，跳过加载');
      return;
    }
    console.log('🚀 开始加载组成员，当前 group:', this.userGroup);
    this.groupMembers = await this.attendanceService.getGroupAttendance(
      this.userGroup
    );
    console.log('✅ 加载完成，成员数量:', this.groupMembers.length);
    console.log('👥 组员列表:', this.groupMembers);

    // 因为异步更新数据，手动触发一次模板刷新
    this.cdr.detectChanges();
  }
}
