import { Component } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";


interface User {
    name: string;
    email: string;
}

@Component(
    {
        selector: 'app-users',
        templateUrl: './users.component.html',
    }
)

export class UsersComponent {

    userCol: AngularFirestoreCollection<User>;
    users: any;
    constructor(private afs: AngularFirestore, private _router: Router) { }
    ngOnInit() {
        this.userCol = this.afs.collection('users');
        //this.users = this.userCol.valueChanges();
        this.users = this.userCol.snapshotChanges().pipe
            (

                //取得文档ID
                map(
                    actions => {
                        return actions.map(a => {
                            const data = a.payload.doc.data() as User;
                            const id = a.payload.doc.id;
                            return { id, data };
                        });
                    })
            );

        console.log('user', this.users);
    }

    add() {
        this._router.navigate(['/add']);
    }
    delete(id,name)
    {
        if(confirm("Are you sure to delete user: "+name+" ?"))
        {
            this.afs.doc('users/'+id).delete();
        }
    }
}
