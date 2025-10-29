import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, take, tap} from 'rxjs/operators';
import { Note } from '../models/note.model';



@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }


  //获取用户笔记
  getUserNotes() {
    return this.afAuth.user.pipe(
      map(user => user?.uid),
      switchMap(uid => this.afs.collection<Note>('notes', ref => ref.where('uid', '==', uid))
        .valueChanges({ idField: 'id' })
      )
    )
  }

  //添加笔记
  addNote(note: Partial<Note>) {
    return this.afAuth.user.pipe
      (
        take(1),
        map(user => user?.uid),
        tap(uid => {
          if (!uid)
            throw new Error('No user logged in');
          this.afs.collection('notes').add(
            {
              uid,
              title: note.title,
              content: note.content,
              createdAt: new Date()
            });
        })
      );
  }

      // 版本过低不支持
   // async addNote1(note: Partial<Note>) {
  //   const user = await firstValueFrom(
  //     this.afAuth.user.pipe(take(1))
  //   );
  //   if (!user)
  //     throw new Error('No user logged in');
  //   return
  //   this.afs.collection('notes').add(
  //     {
  //       uid: user.uid,
  //       title: note.title,
  //       Content: note.content,
  //       createdAt: new Date()
  //     }
  //   );
  // }

  // 用户更新
  updateNote(id:string,data:Partial<Note>)
  {
      return this.afs.doc(`notes/${id}`).update(
        {
          ...data,
          updatedAt:new Date()
        });
  }

  //删除日志
  deleteNote(id:string){
    return this.afs.doc<Note>(`notes/${id}`).delete();
  }

  //取得的日志
  getNoteById(id:string)
  {
    return this.afs.doc<Note>(`notes/${id}`).valueChanges(
      {
        idField : 'id'
      }

    );
  }




}
