import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private firestore:AngularFirestore) { 
    
    // //firebase链接测试 
    // if(this.firestore)
    // {
    //   console.log("firebase connected successfully");
    // }
    // else
    // {
    //   console.log("firebase connection failed!!")
    // }

  }

  ngOnInit(): void {
  }

}
