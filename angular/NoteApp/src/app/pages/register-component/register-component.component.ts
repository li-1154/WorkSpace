import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css']
})
export class RegisterComponent implements OnInit {

  errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': '该邮箱已被注册，请直接登录。',
    'auth/invalid-email': '邮箱格式不正确。',
    'auth/weak-password': '密码太弱,请设置至少6位密码。',
    'auth/missing-password': '请输入密码。',
  };



  email: string;
  password: string;
  errorMsg: string;

  constructor(private afs: AngularFireAuth, private router: Router) { }

  async register() {
    try {
      await this.afs.createUserWithEmailAndPassword(this.email, this.password)
      console.log('register,success!');
      this.router.navigate(['/login']);
    }
    catch (error) {
      console.log('❌ Firebase Error:', error);
      this.errorMsg = error.message; // 临时先显示英文
      // this.errorMsg = this.errorMessages[error.code]||'注册失败，请稍后再试。';
      // console.error('register,failed', error);
    }
  }
  ngOnInit(): void {
    console.log('测试', this.afs);
  }

}
