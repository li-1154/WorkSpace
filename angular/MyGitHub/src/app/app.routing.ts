import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { HomeComponent } from './home.component';
import { NotFoundComponent } from './notfound.component';
import { GitHubComponent } from './github.component';
import { GitHubUserComponent } from './githubuser.component'
import { HtmlComponentComponent } from "./html-component/html-component.component"; 
import { MyCRUDAppComponent } from "./my-crudapp/my-crudapp.component";
import { UsersComponent } from "./users.component";

export const routing = RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'github', component: GitHubComponent },
        { path: 'html', component: HtmlComponentComponent },
    { path: 'github/user/:login/:score', component: GitHubUserComponent },
    { path: 'my-crudapp', component: MyCRUDAppComponent },
    { path: 'users', component: UsersComponent },
    { path: '**', component: NotFoundComponent }
])