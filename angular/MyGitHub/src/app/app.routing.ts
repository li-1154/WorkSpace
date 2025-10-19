import { Route,RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { HomeComponent } from './home.component';
import { NotFoundComponent } from './notfound.component';
import { GitHubComponent } from './github.component';

export const routing = RouterModule.forRoot([
    {path:'',component:HomeComponent},
    {path:'github',component:GitHubComponent},
    {path:'**',component:NotFoundComponent}
])