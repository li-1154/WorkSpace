import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../user';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  form: FormGroup;
  user = new User();
  title = '';

  constructor(fb: FormBuilder, private _router: Router, private afs: AngularFirestore) {
    this.form = fb.group({
      name:['',Validators.required],
      email:['',Validators.required]
  });}


  ngOnInit(): void {
    this.title = "New User";
  }
  sunmit(){
    //链接到firestore添加用户
    this.afs.collection('users').add({
      name:this.user.name,
      email:this.user.email
    })
    //导航到用户列表
    alert("User added successfully!");
    this._router.navigate(['/users']);
  }
}
