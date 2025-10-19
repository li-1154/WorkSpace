import { Component } from '@angular/core';
import { UserFromComponent } from './user-form.component';

@Component({
  selector: 'app-root',
  template: `<user-from></user-from>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test1';
}
