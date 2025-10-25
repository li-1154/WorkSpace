import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';
import { HomeComponent } from './pages/home-component/home-component.component';
import { LoginComponent } from './pages/login-component/login-component.component';
import { RegisterComponent } from './pages/register-component/register-component.component';
import { NotesListComponent } from './pages/notes-list-component/notes-list-component.component';
import { NoteEditComponent } from './pages/note-edit-component/note-edit-component.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  {path: 'notes', component: NotesListComponent,canActivate:[AuthGuard] /*, canActivate: [AuthGuard]*/},
  {path: 'notes/:id', component: NoteEditComponent, canActivate: [AuthGuard]},

  {path: '**', redirectTo: ''}

];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
