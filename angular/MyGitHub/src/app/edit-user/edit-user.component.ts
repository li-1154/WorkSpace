import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../user';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  form: FormGroup;
  user = new User();
  title = '';
  id: string = '';

  userDoc: AngularFirestoreDocument<User>;
  singleUser: Observable<User>;

  constructor(fb: FormBuilder, private _router: Router, private afs: AngularFirestore, private _route: ActivatedRoute) {
    this.form = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.id = params['id'];
      console.log('id', this.id);
    });
    if (!this.id) {

      this.title = "New User";
    }
    else {
      this.title = "Edit User";
      this.userDoc = this.afs.doc('users/' + this.id);
      this.singleUser = this.userDoc.valueChanges();
      this.singleUser.subscribe(userdata => {
        this.form.get('name').setValue(userdata.name);
        this.form.get('email').setValue(userdata.email);
      })
    }
  }


  sunmit() {
    if (this.id) {
      this.afs.doc('users/' + this.id).update({
        name: this.user.name,
        email: this.user.email
      })
      alert("User updated successfully!");
    }
    else {
      this.afs.collection('users').add({
        name: this.user.name,
        email: this.user.email
      })
      alert("User added successfully!");
    }
    //导航到用户列表
    this._router.navigate(['/users']);
  }
}
