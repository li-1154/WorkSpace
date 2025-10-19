import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter } from 'rxjs';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
  <div>{{Messgae}}</div>
  <input class="from-control" type="search"
        [formControl] = "searchControl"> 
  `
})
export class AppComponent {
  title = 'observableExample';

  searchControl = new FormControl();
  Messgae: any = "please input data:";
  constructor() {
    this.searchControl.valueChanges.pipe(filter(
      text => text.length >= 3
    ), debounceTime(1111400))
      .subscribe(
        (value) => {
          this.Messgae = "input data is:" + value;
          console.log(value)
        }
      );
  }
}

