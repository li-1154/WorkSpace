import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home-component/home-component.component';
import { LoginComponent } from './pages/login-component/login-component.component';
import { RegisterComponent } from './pages/register-component/register-component.component';
import { NotesListComponent } from './pages/notes-list-component/notes-list-component.component';
import { NoteEditComponent } from './pages/note-edit-component/note-edit-component.component';
import { HeaderComponent } from './components/header-component/header-component.component';
import { FooterComponent } from './components/footer-component/footer-component.component';
import { NoteItemComponent } from './components/note-item-component/note-item-component.component';
import { NoteFormComponent } from './components/note-form-component/note-form-component.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NotesListComponent,
    NoteEditComponent,
    HeaderComponent,
    FooterComponent,
    NoteItemComponent,
    NoteFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
