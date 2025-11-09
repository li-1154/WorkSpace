import { Component } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
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

  constructor(private taskService: TaskService,private auth: AuthService,) { }
   ngOnInit() {
    //添加时间显示
    this.currentTime = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    this.timer = setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    }, 1000);
  
    this.todayTasks$ =  this.auth.user$.pipe(
      switchMap(async user =>
      {
        if(!user)
          return[];
        return await this.taskService.getTodayTasks();

      }
      ),
      switchMap(obs=>obs)
    );
    console.log(this.todayTasks$);


  }
  showAddTask = false;

  todayTasks$!: Observable<Task[]>;  // 用 $ 结尾表示是 Observable

  collapsed = { today: false, overdue: true, done: true };



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
  }

  loadTasks() {
      this.todayTasks();
  }

  todayTasks() {

  }

  overdueTasks() {

  }

  doneTasks() {

  }

  toggleCollapse(section: 'today' | 'overdue' | 'done') {
    this.collapsed[section] = !this.collapsed[section];
  }

  priorityClass(priority: string) {
    switch (priority) {
      case '重要': return 'bg-primary text-white';
      case '紧急': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  selectTask(task: Task) { task.showActions = !task.showActions; }
  editTask(task: Task, e: Event) { e.stopPropagation(); console.log('编辑:', task); }
  deleteTask(task: Task, e: Event) {
    e.stopPropagation();

  }

  formatDate(t: Task) {
    return `${t.startTime}〜${t.endTime}`;
  }
}

