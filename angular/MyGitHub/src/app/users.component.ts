import { Component } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";


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
    constructor(private afs: AngularFirestore) { }
    ngOnInit() {
        this.userCol = this.afs.collection('users');
        this.users = this.userCol.valueChanges();
        console.log('user',this.users);
    }
}
