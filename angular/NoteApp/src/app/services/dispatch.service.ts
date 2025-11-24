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
export class DispatchService {
  private collection: AngularFirestoreCollection<Dispatch>;
  constructor(private afs: AngularFirestore) {
    this.collection = this.afs.collection<Dispatch>('dispatch', (ref) =>
      ref.orderBy('name')
    );
  }
  getDispatchs(): Observable<Dispatch[]> {
    return this.collection.snapshotChanges().pipe(
      map((action) =>
        action.map((a) => {
          const data = a.payload.doc.data() as Dispatch;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  addDispatch(name: string): Promise<any> {
    return this.collection.add({
      name,
      active: true,
    });
  }

  updateDispatch(id: string, name: string): Promise<void> {
    return this.collection.doc(id).update({ name });
  }

  deactivateDispatch(id: string, active: boolean): Promise<void> {
    return this.collection.doc(id).update({ active });
  }

  deleteDispatch(id: string): Promise<void> {
    return this.collection.doc(id).delete();
  }


}

export interface Dispatch {
  id?: string;
  name: string;
  active: boolean;
}
