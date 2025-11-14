import { Component, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  currentUid: string | null = null;

  members: any[] = [];    // 全部用户列表
  selectedMembers: string[] = [];  // 选中的UID列表

  task: Task = {
    name: '',
    startTime: '',
    endTime: '',
    date: new Date(Date.now()+9*60*60*1000).toISOString().split('T')[0],
    priority: '重要',
    done: false,
    type: 'personal',
    isShared: false,
    teamMembers: []
  };

  constructor(
    private taskService: TaskService,
    private auth: AuthService,
    private afs: AngularFirestore
  ) {}

  async ngOnInit() {
    // 当前用户
    const user = await this.auth.getCurrentUser();
    this.currentUid = user?.uid ?? null;

    if (!this.currentUid) return;

    // 默认成员（自己）
    this.selectedMembers = [this.currentUid];
    this.task.teamMembers = [this.currentUid];

    // 加载 users 集合里的全体成员
    this.afs.collection('users').valueChanges({ idField: 'uid' })
      .subscribe(users => {
        this.members = users;
      });
  }

  // 切换选项
  toggleMember(uid: string) {
    if (uid === this.currentUid) return; // 自己不可取消

    if (this.selectedMembers.includes(uid)) {
      this.selectedMembers = this.selectedMembers.filter(x => x !== uid);
    } else {
      this.selectedMembers.push(uid);
    }

    this.task.teamMembers = [...this.selectedMembers];
  }

  async addTask() {
    try {
      // 如果勾选共享但没选任何人 → 最少要包含自己
      if (this.task.isShared && this.selectedMembers.length === 0) {
        this.selectedMembers = [this.currentUid!];
      }

      this.task.teamMembers = [...this.selectedMembers];

      await this.taskService.addtask(this.task);
      this.save.emit();
      this.resetForm();
    }
    catch (err) {
      console.error(err);
    }
  }

  resetForm() {
    this.task.name = '';
    this.task.startTime = '';
    this.task.endTime = '';
  }
}
