import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(private afs: AngularFireAuth, private router: Router) { }

  private authSub: any;
  ngOnInit(): void {
    this.authSub = this.afs.authState.subscribe(user =>
    {
      if(user)
      {
        alert('请先登出');
        return;
      }
    }
  }
  async login() {
    try {
      await this.afs.signInWithEmailAndPassword(this.email, this.password)
      console.log('✅ Login success!');
      this.router.navigate(['/notes']);
    }
    catch (error) {
      this.errorMsg = error.message;
      console.error('❌ Login failed:', error);
    }
  }

}
