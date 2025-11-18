import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AttendanceRecord } from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) { }

  private getLocalDateStr():string
  {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth()+1).padStart(2,'0');
    const dd = String(now.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }



  async logAttendance(type: string) {
    const user = await this.afAuth.currentUser;
    if (!user) {
      alert('请先登录');
      return;
    }

    const uid = user.uid;
    const now = new Date();
    const dateStr = this.getLocalDateStr();
    const timeStr = now.toTimeString().split(' ')[0];

    const userRef = this.afs.collection('users').doc(uid);
    const userSnap = await userRef.get().toPromise();
    const userData = userSnap?.data() as any;
    const name = userData?.name || '未設定';
    const group = userData?.group || '未設定';

    const recordRef = this.afs
      .collection('attendance')
      .doc(uid)
      .collection('records')
      .doc(dateStr);

    const recordSnap = await recordRef.get().toPromise();

    const statusMap: any = {
      '出勤': 1,
      '中途出勤': 2,
      '中途退勤': 3,
      '退勤': 4,
    };


    try {
      if (recordSnap?.exists) {
        await recordRef.update({
          [this.getFieldName(type)]: timeStr,
          status: statusMap[type],
          updatedAt: now,
        });
        if(type=='退勤')
        {
          const updatedRecord = (await recordRef.get().toPromise())?.data() as AttendanceRecord;
          const workedHours = this.getWorkDuration(updatedRecord);

          await recordRef.update(
            {
              workedHours:workedHours
            }
          );
        }
      } else {
        const record: AttendanceRecord = {
          uid,
          name,
          group,
          date: dateStr,
          [this.getFieldName(type)]: timeStr,
          status: statusMap[type],
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
    const dateStr = this.getLocalDateStr();

    const docSnap = await this.afs
      .collection('attendance')
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
  async getUserInfo() {
    const user = await this.afAuth.currentUser;
    if (!user) return null;

    const uid = user.uid;
    const userRef = this.afs.collection('users').doc(uid);
    const userSnap = await userRef.get().toPromise();
    return (userSnap?.data() as any) || null;

  }

  async getGroupAttendance(group: string): Promise<{ 
  name: string; 
  checkIn?: string; 
  breakOut?: string; 
  breakIn?: string; 
  checkOut?: string;
  workedHours?:string
}[]> {
  if (!group) return [];

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const snapshot = await this.afs.collectionGroup('records', ref =>
    ref.where('group', '==', String(group)).where('date', '==', todayStr)
  ).get().toPromise();

  return snapshot?.docs.map(doc => doc.data() as any) || [];
}





  getWorkDuration(record:AttendanceRecord |null): string | null {
  if (!record?.checkIn || !record?.checkOut) return null;

  const toMs = (t: string) => {
    const [h, m, s] = t.split(':').map(Number);
    return h * 3600000 + m * 60000 + (s || 0) * 1000;
  };

  let totalMs = toMs(record.checkOut) - toMs(record.checkIn);

  if (record.breakOut && record.breakIn) {
    totalMs -= toMs(record.breakIn) - toMs(record.breakOut);
  }

  if (totalMs <= 0) return null;

  const h = Math.floor(totalMs / 3600000);
  const m = Math.floor((totalMs % 3600000) / 60000);
  return `${h}小时 ${m}分`;
}



}
