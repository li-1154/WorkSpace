import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponent implements OnInit {
  email:string='';
  password:string= '';
  errorMsg:string = '';

  constructor(private afs:AngularFireAuth,private router:Router) { }

  ngOnInit(): void {
  }
  async login() { 
     try{
        await this.afs.signInWithEmailAndPassword(this.email,this.password)
        console.log('✅ Login success!');
        this.router.navigate(['/notes']);
    }
    catch(error){
      this.errorMsg = error.message;
      console.error('❌ Login failed:', error);
    }
  }
  
}
