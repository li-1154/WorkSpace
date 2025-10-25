import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myc01',
  templateUrl: './myc01.component.html',
  styleUrls: ['./myc01.component.css']
})
export class Myc01Component implements OnInit {

  name: string = '小心心';
  age: number = 18;
  flag: boolean = true;
  hobbies: string[] = ['看书', '听音乐', '旅游'];
  boss: any = { name: '老王', age: 45 };

  constructor() { }

  ngOnInit(): void {
  }

  showName(): string {
    return this.name
      ;
  }
  ShowClick() {
    alert('点击事件被触发了')
  }
}