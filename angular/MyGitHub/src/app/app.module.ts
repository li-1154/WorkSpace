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

@NgModule({
  declarations: [
    AppComponent,GitHubComponent,NotFoundComponent,HomeComponent
  ],
  imports: [
    BrowserModule,HttpClientModule,ReactiveFormsModule,routing
  ],
  providers: [GitHubService],
  bootstrap: [AppComponent]
})
export class AppModule { }
