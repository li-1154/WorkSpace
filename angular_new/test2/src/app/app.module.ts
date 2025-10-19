import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { loginComponent } from './login.componnet';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginService } from './login.service';

@NgModule({
  declarations: [
    AppComponent,loginComponent
  ],
  imports: [
    BrowserModule,ReactiveFormsModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
