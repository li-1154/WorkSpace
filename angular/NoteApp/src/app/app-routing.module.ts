import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home-component/home-component.component';
import { LoginComponent } from './pages/login-component/login-component.component';
import { RegisterComponent } from './pages/register-component/register-component.component';
import { NotesListComponent } from './pages/notes-list-component/notes-list-component.component';
import { AuthGuard } from './guards/auth.guard';
import { NoteFormComponent } from './pages/note-form/note-form.component';
import { AboutComponent } from './pages/about/about.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { TaskListComponent } from './pages/task/task-list/task-list.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';

const routes: Routes = [
  //登陆模块
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'progress', component: AboutComponent },
  {
    path: 'Attendance',
    component: AttendanceComponent,
    canActivate: [AuthGuard],
  },
  //笔记模块
  {
    path: 'notes',
    component: NotesListComponent,
    canActivate: [AuthGuard] /*, canActivate: [AuthGuard]*/,
  },
  { path: 'note/new', component: NoteFormComponent, canActivate: [AuthGuard] },
  {
    path: 'note.edit/:id',
    component: NoteFormComponent,
    canActivate: [AuthGuard],
  },
  //Task 模块
  {
    path: 'Task',
    component: TaskListComponent,
    canActivate: [AuthGuard],
  },
  //在库模块
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id', component: ProductFormComponent },
  //其他模块
  { path: '**', redirectTo: '' },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
