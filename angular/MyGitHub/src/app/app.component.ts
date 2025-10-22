import { Component } from '@angular/core';
import { AngularFireModule } from 'angularfire2';

@Component({
  selector: 'app-root',
  template: ` 

<nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Brand</a>
    </div>

    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="active"><a routerLink="">Home <span class="sr-only">(current)</span></a></li>
        <li><a routerLink="github">GitHub</a></li>
        <li><a routerLink="html">HTML</a></li>
        <li><a routerLink="users">Users</a></li>
        <li><a routerLink="my-crudapp">my-crudapp</a></li>
      </ul>
    </div>
  </div>
</nav>




  <!-- <ul>
    <li>
      <a routerLink="">Home</a>
    </li>
    <li>
      <a routerLink="github">GitHub</a>
    </li>
</ul> -->
          
  <router-outlet></router-outlet>
  
       `,
})
export class AppComponent {
  constructor() {
    console.log('AppComponent loaded', AngularFireModule);
  }
}

