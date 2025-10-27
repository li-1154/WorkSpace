import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
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
}
