import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'NoteApp';
  isLoggedIn: boolean = false;   // 是否禁用（无登录用户时）
  private authSub: any;       // 保存订阅对象，用于销毁时清理

  // ✅ 只需要注入一个 AngularFireAuth（你原本写了两次）
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  // ===========================
  // 🔹 登出处理
  // ===========================
  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);   // 登出后跳转登录页
    });
  }

  // ===========================
  // 🔹 初始化
  // ===========================
  ngOnInit(): void {
    // 监听用户认证状态变化
    this.authSub = this.afAuth.authState.subscribe(user => {
      if (!user) {
        // 用户未登录 → 禁用操作、跳转登录
        this.isLoggedIn = false;
      } else {
        // 用户已登录
        this.isLoggedIn = true;
      }
    });
  }

  // ===========================
  // 🔹 组件销毁时清理订阅
  // ===========================
  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
