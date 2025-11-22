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
export class CategorieService {

  private collection: AngularFirestoreCollection<Categorie>;
    constructor(private afs: AngularFirestore) {
      this.collection = this.afs.collection<Categorie>('categories', (ref) =>
        ref.orderBy('name')
      );
    }
    getCategories(): Observable<Categorie[]> {
      return this.collection.snapshotChanges().pipe(
        map((action) =>
          action.map((a) => {
            const data = a.payload.doc.data() as Categorie;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
    }
  
    addCategorie(name: string): Promise<any> {
      return this.collection.add({
        name,
        active: true,
      });
    }
  
    updateCategorie(id: string, name: string): Promise<void> {
      return this.collection.doc(id).update({ name });
    }
  
    deactivateCategorie(id: string,active:boolean): Promise<void> {
      return this.collection.doc(id).update({ active });
    }
  
    deleteCategorie(id: string): Promise<void> {
      return this.collection.doc(id).delete();
    }
}


export interface Categorie {
  id?: string;
  name: string;
  active: boolean;
}
