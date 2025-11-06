import { Component } from '@angular/core';

interface Task {
  name: string;
  date: string; // 当天日期
  startTime: string;
  endTime: string;
  priority: string;
  done: boolean;
  showActions?: boolean;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  currentTab = 'personal';
  showAddTask = false;

  collapsed = { today: false, overdue: true, done: true };

  todayStr = new Date().toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  tasks: Task[] = [
    { name: '会议准备', date: '2025-11-06', startTime: '09:00', endTime: '10:00', priority: '重要', done: false },
    { name: '代码Review', date: '2025-11-05', startTime: '14:00', endTime: '15:00', priority: '紧急', done: false },
    { name: '日报提交', date: '2025-11-04', startTime: '17:00', endTime: '18:00', priority: '不重要・不紧急', done: true },
  ];

  newTask: Task = { name: '', date: '', startTime: '', endTime: '', priority: '', done: false };

  // 切换显示新增任务表单
  toggleAddTask() {
    this.showAddTask = !this.showAddTask;
    const today = new Date().toISOString().split('T')[0];
    this.newTask = { name: '', date: today, startTime: '', endTime: '', priority: '', done: false };
  }

  // 折叠展开
  toggleCollapse(section: 'today' | 'overdue' | 'done') {
    this.collapsed[section] = !this.collapsed[section];
  }

  // 新增任务（当天内时间区间）
  addTask() {
    if (!this.newTask.name || !this.newTask.startTime || !this.newTask.priority) return;
    this.tasks.push({ ...this.newTask });
    this.toggleAddTask();
  }

  // 完成/未完成切换
  toggleDone(t: Task, e?: Event) {
    if (e) e.stopPropagation();
    t.done = !t.done;
    t.showActions = false;
  }

  // 选择任务，显示编辑/删除按钮
  selectTask(t: Task) {
    this.tasks.forEach(x => x.showActions = false);
    t.showActions = !t.showActions;
  }

  deleteTask(t: Task, e: Event) {
    e.stopPropagation();
    this.tasks = this.tasks.filter(x => x !== t);
  }

  editTask(t: Task, e: Event) {
    e.stopPropagation();
    alert(`编辑任务: ${t.name}`);
  }

  // 日期时间显示「11月7日(金) 09:00～11:00」
  formatDate(t: Task) {
    const d = new Date(t.date);
    const w = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
    let str = `${d.getMonth() + 1}月${d.getDate()}日(${w})`;
    if (t.startTime && t.endTime) str += ` ${t.startTime}～${t.endTime}`;
    else if (t.startTime) str += ` ${t.startTime}`;
    return str;
  }

  // 今日任务
  todayTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => t.date === today && !t.done);
  }

  // 未完成（日期早于今天）
  overdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => !t.done && t.date < today);
  }

  // 已完成
  doneTasks() {
    return this.tasks.filter(t => t.done);
  }

  // 优先级颜色
  priorityClass(priority: string) {
    switch (priority) {
      case '重要': return 'bg-danger text-white';
      case '紧急': return 'bg-warning text-dark';
      default: return 'bg-secondary text-white';
    }
  }
}
