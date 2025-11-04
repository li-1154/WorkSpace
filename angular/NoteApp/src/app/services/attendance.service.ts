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

  async getGroupAttendance(group: string): Promise<{ name: string; status: string; time: string }[]> {
  if (!group) return [];

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  console.log('🔥 当前 group:', group, typeof group, '日期:', todayStr);
  try {
    const snapshot = await this.afs.collectionGroup('records', ref =>
      ref.where('group', '==', String(group)).where('date', '==', todayStr)
    ).get().toPromise();

    console.log('📦 查询结果数量:', snapshot?.size);

    snapshot?.docs.forEach(doc => {
      console.log('➡️ 文档路径:', doc.ref.path);
      console.log('➡️ 数据:', doc.data());
    });

    const members = snapshot?.docs.map(doc => {
      const data = doc.data() as any;
      console.log('✅ 映射到成员:', data.name, data.status, data.date); // << 新增日志

      let status = '未出勤';
      let time = '';

      if (data.checkOut) {
        status = '退勤';
        time = data.checkOut;
      } else if (data.breakOut) {
        status = '中途退勤';
        time = data.breakOut;
      } else if (data.breakIn) {
        status = '中途出勤';
        time = data.breakIn;
      } else if (data.checkIn) {
        status = '出勤';
        time = data.checkIn;
      }

      return { name: data.name || '未設定', status, time: time || '-' };
    }) || [];

    console.log('📋 成员数据:', members);
    return members;
  } catch (err) {
    console.error('❌ 获取组员出勤失败:', err);
    return [];
  }
}



}
