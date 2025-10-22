import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { GitHubService } from './github.service';
import { GitHubComponent } from './github.component';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { NotFoundComponent } from './notfound.component';
import { routing } from './app.routing';
import { GitHubUserComponent } from './githubuser.component';
import { HtmlComponentComponent } from './html-component/html-component.component';
import { MyCRUDAppComponent } from './my-crudapp/my-crudapp.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../environments/environment';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [
    AppComponent, GitHubComponent, NotFoundComponent, HomeComponent, GitHubUserComponent, HtmlComponentComponent, MyCRUDAppComponent,UsersComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule, 
    ReactiveFormsModule,
    routing,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [GitHubService],
  bootstrap: [AppComponent]
})
export class AppModule { }
