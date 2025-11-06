import { Component } from '@angular/core';

interface Task {
  name: string;
  date: string;
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
    { name: '会议准备', date: '2025-11-06T09:00', priority: '重要', done: false },
    { name: '代码Review', date: '2025-11-05T14:00', priority: '紧急', done: false },
    { name: '日报提交', date: '2025-11-04T17:00', priority: '不重要・不紧急', done: true },
  ];

  newTask: Task = { name: '', date: '', priority: '', done: false };

  toggleAddTask() {
    this.showAddTask = !this.showAddTask;
    this.newTask = { name: '', date: '', priority: '', done: false };
  }

  toggleCollapse(section: 'today' | 'overdue' | 'done') {
    this.collapsed[section] = !this.collapsed[section];
  }

  addTask() {
    if (!this.newTask.name || !this.newTask.date || !this.newTask.priority) return;
    this.tasks.push({ ...this.newTask });
    this.toggleAddTask();
  }

  toggleDone(t: Task, e?: Event) {
    if (e) e.stopPropagation();
    t.done = !t.done;
  }

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

  formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const w = ['日','月','火','水','木','金','土'][d.getDay()];
    const time = d.toTimeString().slice(0, 5);
    return `${d.getMonth() + 1}月${d.getDate()}日(${w}) ${time}`;
  }

  todayTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => t.date.startsWith(today));
  }

  overdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => !t.done && t.date < today);
  }

  doneTasks() {
    return this.tasks.filter(t => t.done);
  }

  priorityClass(priority: string) {
    switch (priority) {
      case '重要': return 'bg-danger text-white';
      case '紧急': return 'bg-warning text-dark';
      default: return 'bg-secondary text-white';
    }
  }
}
