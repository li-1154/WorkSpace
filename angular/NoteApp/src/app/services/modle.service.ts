import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModleService {

  private collection: AngularFirestoreCollection<Modle>;
  constructor(private afs: AngularFirestore) {
    this.collection = this.afs.collection<Modle>('modle', (ref) =>
      ref.orderBy('name')
    );
  }
  getModles(): Observable<Modle[]> {
    return this.collection.snapshotChanges().pipe(
      map((action) =>
        action.map((a) => {
          const data = a.payload.doc.data() as Modle;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  addModle(name: string): Promise<any> {
    return this.collection.add({
      name,
      active: true,
    });
  }

  updateModle(id: string, name: string): Promise<void> {
    return this.collection.doc(id).update({ name });
  }

  deactivateModle(id: string, active: boolean): Promise<void> {
    return this.collection.doc(id).update({ active });
  }

  deleteModle(id: string): Promise<void> {
    return this.collection.doc(id).delete();
  }


}

export interface Modle {
  id?: string;
  name: string;
  active: boolean;
}