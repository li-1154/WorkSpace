import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { HomeComponent } from './home.component';
import { NotFoundComponent } from './notfound.component';
import { GitHubComponent } from './github.component';
import { GitHubUserComponent } from './githubuser.component'
import { HtmlComponentComponent } from "./html-component/html-component.component"; 

export const routing = RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'github', component: GitHubComponent },
        { path: 'html', component: HtmlComponentComponent },
    { path: 'github/user/:login/:score', component: GitHubUserComponent },
    { path: '**', component: NotFoundComponent }
])