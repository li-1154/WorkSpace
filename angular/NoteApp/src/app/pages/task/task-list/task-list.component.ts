import { Component } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent {
  currentTab: 'personal' | 'group' = 'personal';
  timer: any;
  currentTime: any;

  todayStr = new Date().toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  // ----------------------------
  // 各任务流
  // ----------------------------
  todayTasks$!: Observable<Task[]>;
  doneTasks$!: Observable<Task[]>;
  noDoneTasks$!: Observable<Task[]>;

  // 共享任务
  teamTodayTasks$!: Observable<Task[]>;
  teamDoneTasks$!: Observable<Task[]>;
  teamNoDoneTasks$!: Observable<Task[]>;

  showAddTask = false;

  collapsed = {
    today: false,
    overdue: true,
    done: true,

    teamToday: false,
    teamNoDone: true,
    teamDone: true,
  };

  constructor(
    private taskService: TaskService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // 时间显示
    this.currentTime = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    this.timer = setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    }, 1000);

    // 加载个人任务
    this.todayTasks$ = this.auth.user$.pipe(
      switchMap(async (user) => user ? await this.taskService.getTodayTasks() : []),
      switchMap((obs) => obs)
    );

    this.doneTasks$ = this.auth.user$.pipe(
      switchMap(async (user) => user ? await this.taskService.getTasksDone() : []),
      switchMap((obs) => obs)
    );

    this.noDoneTasks$ = this.auth.user$.pipe(
      switchMap(async (user) => user ? await this.taskService.getTaskNoDone() : []),
      switchMap((obs) => obs)
    );

    // 加载共享任务
    this.teamTodayTasks$ = this.auth.user$.pipe(
      switchMap(async (user) => user ? await this.taskService.getTodayTeamTasks() : []),
      switchMap((obs) => obs)
    );

    this.teamDoneTasks$ = this.auth.user$.pipe(
      switchMap(async (user) => user ? await this.taskService.getTeamTasksDone() : []),
      switchMap((obs) => obs)
    );

    this.teamNoDoneTasks$ = this.auth.user$.pipe(
      switchMap(async (user) => user ? await this.taskService.getTeamTaskNoDone() : []),
      switchMap((obs) => obs)
    );
  }

  toggleAddTask() {
    this.showAddTask = !this.showAddTask;
  }

  addTask(event: Task) {
    this.loadTasks();
    this.toggleAddTask();
  }

  loadTasks() {}

toggleCollapse(section: 'today' | 'overdue' | 'done' | 'teamToday' | 'teamNoDone' | 'teamDone') {
  this.collapsed[section] = !this.collapsed[section];
}

  priorityClass(priority: string) {
    switch (priority) {
      case '重要':
        return 'bg-primary text-white';
      case '紧急':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  selectTask(task: Task) {
    task.showActions = !task.showActions;
  }

  toggleDone(task: Task, e: Event) {
    e.stopPropagation();
    task.done = !task.done;
    this.taskService.updateTaskDone(task.id!, task.done);
  }

  deleteTask(task: Task, e: Event) {
    e.stopPropagation();
    if (confirm(`「${task.name}」を削除しますか？`)) {
      this.taskService.deleteTask(task.id!);
    }
  }

  formatDate(t: Task) {
    const date = t.date?.replace(/-/g, '/');
    return `${date} ${t.startTime}〜${t.endTime}`;
  }

  startEdit(task: Task, e: Event) {
    e.stopPropagation();
    task.backup = { ...task };
    task.editing = true;
  }

  saveEdit(task: Task, e: Event) {
    e.stopPropagation();
    task.editing = false;

    this.taskService.updateTask(task.id!, {
      name: task.name,
      startTime: task.startTime,
      endTime: task.endTime,
      priority: task.priority,
    });
  }

  cancelEdit(task: Task, e: Event) {
    e.stopPropagation();
    if (task.backup) Object.assign(task, task.backup);
    task.editing = false;
  }
}
