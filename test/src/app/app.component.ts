import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <!-- <h1> {{title}}</h1>
  <img src="{{imgurl}}"/>
  <br> -->
  <products-root></products-root>
  <!-- <rating [rating]="4"></rating>
  <br>
  <rating [rating]="5"></rating> -->
  <!-- <br>
  <button (click)="onclickme($event)" class="btn btn-primary" [class.disabled]=isValid>Primary</button>
  <br>
  <button type="button" class="btn btn-secondary" [class.disabled]=isValid>Secondary</button> -->
  `
})

export class AppComponent {
  title = 'This is appcomponent test';
  imgurl = "https://www.baidu.com/img/flexible/logo/pc/result.png";
  isValid = false;
  onclickme($event: Event){
    console.log("click",$event)

  }

}


