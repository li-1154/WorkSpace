import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AttendanceRecord } from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  async logAttendance(type: string) {
    const user = await this.afAuth.currentUser;
    if (!user) {
      alert('请先登录');
      return;
    }

    const uid = user.uid;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const userRef = this.afs.collection('users').doc(uid);
    const userSnap = await userRef.get().toPromise();
    const userData = userSnap?.data() as any;
    const name = userData?.name || '未設定';
    const group = userData?.group || '未設定';

    const recordRef = this.afs
      .collection('attendancd')
      .doc(uid)
      .collection('records')
      .doc(dateStr);

    const recordSnap = await recordRef.get().toPromise();

    try {
      if (recordSnap?.exists) {
        await recordRef.update({
          [this.getFieldName(type)]: timeStr,
          updatedAt: now,
        });
      } else {
        const record: AttendanceRecord = {
          uid,
          name,
          group,
          date: dateStr,
          [this.getFieldName(type)]: timeStr,
          createdAt: now,
        };

        await recordRef.set(record);
      }
      console.log(
        `✅ ${type} 已记录：${name}（${group}） ${dateStr} ${timeStr}`
      );
      return { success: true, time: timeStr };
    } catch (error) {
      console.error('❌ 出勤记录失败:', error);
      return { success: false };
    }
  }

  async getTodayRecord() {
    const user = await this.afAuth.currentUser;
    if (!user) return null;

    const uid = user.uid;
    const dateStr = new Date().toISOString().split('T')[0];

    const docSnap = await this.afs
      .collection('attendancd')
      .doc(uid)
      .collection('records')
      .doc(dateStr)
      .get()
      .toPromise();

    return (docSnap?.data() as AttendanceRecord) || null;
  }

  private getFieldName(type: string): keyof AttendanceRecord {
    switch (type) {
      case '出勤':
        return 'checkIn';
      case '中途退勤':
        return 'breakOut';
      case '中途出勤':
        return 'breakIn';
      case '退勤':
        return 'checkOut';
      default:
        return 'checkIn';
    }
  }
}
