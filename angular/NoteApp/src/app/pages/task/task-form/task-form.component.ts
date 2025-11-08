import { Component, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  task: Task = {
    name: '',
    startTime: '',
    endTime: '',
    data: new Date().toISOString().slice(0, 10),
    priority: '重要',
    done: false,
    type: 'personal',
    isShared: false

  }


  constructor(private taskservice: TaskService) { }

  async addTask() {
    try {
      await this.taskservice.addtask(this.task);
      this.save.emit();
      this.resetFrom();
    }
    catch (err) {
       console.log('err',this.task);
      console.error(err);
    }
  }

  resetFrom() {
    this.task = {
      ...this.task,
      name: '',
      startTime: '',
      endTime: ''
    };
  }

}

