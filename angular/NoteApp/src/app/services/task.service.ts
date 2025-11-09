import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private afs: AngularFirestore, private auth: AuthService) {}

  private async getUserOrThrow() {
    const user = await this.auth.getCurrentUser();
    console.log('currentUser =', user);
    if (!user) throw new Error('用户未登录！');
    return user;
  }
//新建列表
  async addtask(task: Task): Promise<void> {
    const user = await this.getUserOrThrow();
    const id = this.afs.createId();
    //这行代码的目的就是：
    //根据前端传来的任务对象（task）生成一个完整、可存进 Firestore 的任务对象。

    //它会：
    //继承前端表单中输入的所有字段；
    //自动补上当前用户ID（uid）；
    //判断是否共享；
    //自动设置创建时间和更新时间。
    const newTask: Task = {
      ...task,
      id,
      uid: user.uid,
      teamMembers: task.isShared ? task.teamMembers ?? [user.uid] : [user.uid],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.afs.collection('tasks').doc(id).set(newTask);
  }
//获取当天新建信息
  async getTodayTasks(): Promise<Observable<Task[]>> {
    const user = await this.getUserOrThrow();
    const today = new Date().toISOString().slice(0, 10);
    const snapshot = this.afs.collection<Task>(
      'tasks',
      (ref) => ref.where('uid', '==', user.uid).where('date','==',today).where('done','==',false)
      .orderBy('date','asc')
    ).valueChanges();
    return snapshot;
  }
//完成切换 done 设置为 true
async updateTaskDone(id:string,done:boolean):Promise<void>
{
  const user = await this.getUserOrThrow();
  return this.afs.collection('tasks')
  .doc(id).update(
    {
      done,
      updatedAt: new Date(),
      uid:user.uid
    }
  );
}

//获取已经完成信息
  async getTasksDone(): Promise<Observable<Task[]>> {
    const user = await this.getUserOrThrow();
    const snapshot = this.afs.collection<Task>(
      'tasks',
      (ref) => ref.where('uid', '==', user.uid).where('done','==',true)
      .orderBy('date','asc')
    ).valueChanges();
    return snapshot;
  }

//获取未完成信息
  async getTaskNoDone(): Promise<Observable<Task[]>> {
    const user = await this.getUserOrThrow();
    const today = new Date().toISOString().slice(0, 10);
    const snapshot = this.afs.collection<Task>(
      'tasks',
      (ref) => ref.where('uid', '==', user.uid).where('date','!=',today).where('done','==',false)
      .orderBy('date','asc')
    ).valueChanges();
    return snapshot;
  }

 
}
