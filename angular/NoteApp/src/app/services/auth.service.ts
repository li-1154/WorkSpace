import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  /**
   * ✅ 注册新用户 + 同步写入 Firestore 的 users 集合
   */
  async register(email: string, password: string, name: string, group: string) {
    try {
      // 1️⃣ 创建 Auth 账号
      const cred = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = cred.user?.uid;

      // 2️⃣ 写入 Firestore users 集合
      if (uid) {
        await this.afs.collection('users').doc(uid).set({
          name,
          group,
          email,
          createdAt: new Date(),
        });
        console.log(`✅ 用户资料已保存：${name} (${group})`);
      }

      return { success: true };
    } catch (error) {
      console.error('❌ 注册失败:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * ✅ 登录
   */
  async login(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('✅ 登录成功');
      return { success: true };
    } catch (error) {
      console.error('❌ 登录失败:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * ✅ 登出
   */
  async logout() {
    await this.afAuth.signOut();
  }

  /**
   * ✅ 获取当前用户
   */
  async getCurrentUser() {
    return await this.afAuth.currentUser;
  }
}
