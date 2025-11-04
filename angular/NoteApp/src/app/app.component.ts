import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  user$: Observable<any | null>;


  title = 'NoteApp';
  private authSub: any;       // 保存订阅对象，用于销毁时清理

  // ✅ 只需要注入一个 AngularFireAuth（你原本写了两次）
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user$ = this.afAuth.authState;
   }
  @ViewChild('navbar') navbar: ElementRef;

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

  }

  // ===========================
  // 🔹 组件销毁时清理订阅
  // ===========================
  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  //修复导航不能回弹
  closemenu() {
    if (window.innerWidth < 992) {
      const el = this.navbar?.nativeElement;
      if (el && el.classList.contains('show'))
      {
        el.classList.remove('show');
      }
    }
  }



}
