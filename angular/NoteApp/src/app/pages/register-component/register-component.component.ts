import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  title = '用户注册';
  email = '';
  password = '';
  name = '';
  group = '';
  errorMsg = '';
  userFormDisable = false;  // ✅ 控制表单显示
  private authSub: any;

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  async register() {
    this.errorMsg = '';

    if (!this.email || !this.password || !this.name || !this.group) {
      this.errorMsg = '请完整填写所有字段。';
      return;
    }

    const result = await this.authService.register(this.email, this.password, this.name, this.group);

    if (result.success) {
      alert('注册成功，请使用新账号登录！');
      this.router.navigate(['/login']);
    } else {
      this.errorMsg = result.message || '注册失败，请稍后再试。';
    }
  }

  ngOnInit(): void {
    // ✅ 监听是否有用户登录
    this.authSub = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userFormDisable = true;
        this.title = '您已登录，无需注册';
      } else {
        this.userFormDisable = false;
        this.title = '用户注册';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) this.authSub.unsubscribe();
  }
}
