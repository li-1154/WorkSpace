import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private afs: AngularFirestore, private auth: AuthService) {
  }

 private async getUserOrThrow()
 {
    const user = await this.auth.getCurrentUser();
    console.log('currentUser =', user);
    if (!user) throw new Error('用户未登录！');
    return user ;
 }

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
      teamMembers: task.isShared ? (task.teamMembers ?? [user.uid])
        : [user.uid],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.afs.collection('tasks').doc(id).set(newTask);
  }

 async getTodayTasks():Observable<Task[]>
  {
    const user = await this.getUserOrThrow();
    const today = new Date().toISOString().slice(0,10);
    const snapshot = await this.afs.collection<Task>
    ('tasks',(ref)=>
      ref.where('uid')
    )

  }



}
