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
  title: string = '用户登陆';
  showPassword = false;

  constructor(private afs: AngularFireAuth, private router: Router) { }

  private authSub: any;
  user: any = null;
  userFormdisble: boolean = false;
  ngOnInit(): void {

    this.authSub = this.afs.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.userFormdisble = false;
        this.title = '用户信息';
        console.log('✅ 已登录用户:', this.user);
      } else {
        this.user = null;
        console.log('🚫 未登录');
        this.userFormdisble = true;
      }
    });
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


  logout() {
    this.afs.signOut();
    this.title = '用户登陆';
    this.router.navigate(['/login']);
  }


}
