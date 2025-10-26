import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css']
})
export class RegisterComponent implements OnInit {

  email:string;
  password:string;
  errorMsg:string;

  constructor(private afs:AngularFireAuth,private router:Router ) { }

  async register()
  {
    try{
      await this.afs.createUserWithEmailAndPassword(this.email,this.password)
      console.log('register,success!');
      this.router.navigate(['/login']);
    }
    catch(error)
    {
      this.errorMsg = error.message;
      console.error('register,failed',error);
    }
  }
  ngOnInit(): void {
  }

}
