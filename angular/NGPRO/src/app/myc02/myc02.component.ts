import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myc02',
  templateUrl: './myc02.component.html',
  styleUrls: ['./myc02.component.css']
})
//class 本身属于面向对象的写法
//  class 类名 extends 继承 父类  implements 实现接口
//   属性名 : 类型 = 值
//  方法名(形参: 类型, 形参: 类型): 返回值类型 { 方法体 }
export class Myc02Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
