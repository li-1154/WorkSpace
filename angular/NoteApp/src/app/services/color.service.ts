import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private collection: AngularFirestoreCollection<Color>;
  constructor(private afs: AngularFirestore) {
    this.collection = this.afs.collection<Color>('colors', (ref) =>
      ref.orderBy('name')
    );
  }
  getColors(): Observable<Color[]> {
    return this.collection.snapshotChanges().pipe(
      map((action) =>
        action.map((a) => {
          const data = a.payload.doc.data() as Color;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  addColor(name: string): Promise<any> {
    return this.collection.add({
      name,
      active: true,
    });
  }

  updateColor(id: string, name: string): Promise<void> {
    return this.collection.doc(id).update({ name });
  }

  deactivateColor(id: string): Promise<void> {
    return this.collection.doc(id).update({ active: false });
  }

  deleteColor(id: string): Promise<void> {
    return this.collection.doc(id).delete();
  }
}

export interface Color {
  id?: string;
  name: string;
  active: boolean;
}
