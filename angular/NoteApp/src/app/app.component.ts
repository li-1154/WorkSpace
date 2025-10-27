import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private afs:AngularFireAuth,private router:Router)
  {}
  title = 'NoteApp';
  logout()
  {
    this.afs.signOut();
    this.router.navigate(['/login']);
  }
}