// 导入 Angular 核心模块
import { Component, OnInit } from '@angular/core';

// 使用 @Component 装饰器定义组件
@Component({
  selector: 'app-attendance', // 组件选择器（HTML 标签名）
  templateUrl: './attendance.component.html', // 模板路径
  styleUrls: ['./attendance.component.css'], // 样式路径
})
export class AttendanceComponent implements OnInit {
  // ==============================
  // ✅ 成员变量定义
  // ==============================

  currentDate = ''; // 当前日期字符串（例：11月1日(水)）
  currentTime = ''; // 当前时间字符串（例：14:35:10）
  timer: any; // 用于保存 setInterval 的定时器 ID
  isHoliday = false; // 是否为祝日（true 表示是节假日）
  holidayName = ''; // 祝日名称（例：文化の日）
  datecolor = false; // 是否让日期显示为红色（周末或祝日时 true）
  //周末是否出勤做的验证
  datecolorweekcheck = false; 
  constructor() {}

  // ==============================
  // ✅ 生命周期钩子
  // ==============================
  ngOnInit(): void {
    // 初始化时立即更新一次时间显示
    this.updateDateTime();

    // 每 1 秒更新时间显示（时钟效果）
    this.timer = setInterval(() => this.updateDateTime(), 1000);

    // 检查是否为祝日（通过日本假日 API）
    this.checkHoliday();

    // 检查是否为周六或周日
    this.checkHolidayOrWeekend();
  }

  // ==============================
  // ✅ 更新时间与日期显示
  // ==============================
  updateDateTime() {
    const now = new Date(); // 获取当前时间对象
    const days = ['日', '月', '火', '水', '木', '金', '土']; // 日本星期缩写
    // 组合日期格式示例：11月1日(水)
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日(${
      days[now.getDay()]
    })`;
    // 获取本地时间（日本时区、24小时制）
    const timeStr = now.toLocaleString('ja-JP', { hour12: false });

    // 更新组件绑定数据
    this.currentDate = dateStr;
    this.currentTime = timeStr;
  }

  // ==============================
  // ✅ 检查是否为日本祝日
  // ==============================
  async checkHoliday() {
    const today = new Date();

    // 组装日期字符串为 YYYY-MM-DD 格式
    const dateStr =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      today.getDate().toString().padStart(2, '0');

    try {
      // 🔹 使用日本祝日 API（holidays-jp.github.io）
      const res: any = await fetch(
        `https://holidays-jp.github.io/api/v1/${today.getFullYear()}/date.json`
      );
      const data = await res.json();

      // 如果当前日期存在于返回数据中 → 表示是祝日
      if (data[dateStr]) {
        this.isHoliday = true; // 祝日标志 true
        this.datecolor = true; // 日期标红
        this.holidayName = data[dateStr]; // 保存祝日名称（例：文化の日）
      } else {
        this.isHoliday = false; // 非祝日
      }
    } catch (err) {
      // 捕获网络或 API 错误
      console.error('祝日チェック失敗', err);
    }
  }

  // ==============================
  // ✅ 检查是否为周末（星期六/星期日）
  // ==============================
  async checkHolidayOrWeekend() {
    const now = new Date();
    const day = now.getDay(); // 0=日曜, 6=土曜

    // 如果是周六或周日 → 设置日期标红
    if (day === 0 || day === 6) {
      this.datecolor = true;
    }
  }

  weekendWork() {
   this.datecolorweekcheck = !this.datecolorweekcheck;
  }
}
