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

  constructor(private taskService: TaskService, private auth: AuthService) {}
  ngOnInit() {
    //添加时间显示
    this.currentTime = new Date().toLocaleTimeString('ja-JP', {
      hour12: false,
    });
    this.timer = setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString('ja-JP', {
        hour12: false,
      });
    }, 1000);
    //今日
    this.todayTasks$ = this.auth.user$.pipe(
      switchMap(async (user) => {
        if (!user) return [];
        return await this.taskService.getTodayTasks();
      }),
      switchMap((obs) => obs)
    );
    //已完成
    this.doneTasks$ = this.auth.user$.pipe(
      switchMap(async (user) => {
        if (!user) return [];
        return await this.taskService.getTasksDone();
      }),
      switchMap((obs) => obs)
    );
    console.log(this.doneTasks$);
    //未完成
    this.noDoneTasks$ = this.auth.user$.pipe(
      switchMap(async (user) => {
        if (!user) return [];
        return await this.taskService.getTaskNoDone();
      }),
      switchMap((obs) => obs)
    );
    console.log('今天事项',this.noDoneTasks$);
  }



  showAddTask = false;

  todayTasks$!: Observable<Task[]>; // 用 $ 结尾表示是 Observable

  collapsed = { today: false, overdue: true, done: true };

  doneTasks$!: Observable<Task[]>;

  noDoneTasks$!: Observable<Task[]>;

  toggleAddTask() {
    this.showAddTask = !this.showAddTask;
  }

  addTask(event: any) {
    console.log('🟢 父组件 addTask() 被调用了');
    console.log('🟡 收到 event:', event);
    this.loadTasks();
    this.toggleAddTask();
  }

  toggleDone(t: Task, event: Event) {
    event.stopPropagation();
    t.done = !t.done;
    this.taskService.updateTaskDone(t.id, t.done);
  }

  loadTasks() {
    this.todayTasks();
  }

  todayTasks() {}

  overdueTasks() {}

  toggleCollapse(section: 'today' | 'overdue' | 'done') {
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

  deleteTask(task: Task, e: Event) {
    e.stopPropagation();
    if(confirm(`「${task.name}」を削除しますか？`))
    {
      this.taskService.deleteTask(task.id)
      .then(()=>console.log('删除成功',task.name))
      .catch(err=>console.error('删除失败',err));
      }
  }

formatDate(t: Task) {
  const date = t.date?.replace(/-/g, '/'); // → 2025/11/08
  return `${date}　${t.startTime}〜${t.endTime}`;
}


startEdit(task: Task, e: Event) {
  e.stopPropagation();
  task.backup = { ...task }; // 备份旧值
  task.editing = true;
}

saveEdit(task: Task, e: Event) {
  e.stopPropagation();
  task.editing = false;
  this.taskService.updateTask(task.id, {
    name: task.name,
    startTime: task.startTime,
    endTime: task.endTime,
    priority: task.priority,
  });
  console.log('✅ 保存任务:', task);
}

cancelEdit(task: Task, e: Event) {
  e.stopPropagation();
  if (task.backup) {
    Object.assign(task, task.backup); // 恢复旧值
  }
  task.editing = false;
}


}
