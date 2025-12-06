import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home-component/home-component.component';
import { LoginComponent } from './pages/login-component/login-component.component';
import { RegisterComponent } from './pages/register-component/register-component.component';
import { NotesListComponent } from './pages/notes-list-component/notes-list-component.component';
import { HeaderComponent } from './components/header-component/header-component.component';
import { FooterComponent } from './components/footer-component/footer-component.component';
import { NoteItemComponent } from './components/note-item-component/note-item-component.component';
import { NoteFormComponent } from './pages/note-form/note-form.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { AboutComponent } from './pages/about/about.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { TaskListComponent } from './pages/task/task-list/task-list.component';
import { TaskFormComponent } from './pages/task/task-form/task-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { StockModule } from './models/stock.module';
import { SalesModule } from './models/sales.module';
import { InventoryComponentComponent } from './pages/inventory-component/inventory-component.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NotesListComponent,
    HeaderComponent,
    FooterComponent,
    NoteItemComponent,
    NoteFormComponent,
    AboutComponent,
    AttendanceComponent,
    TaskListComponent,
    TaskFormComponent,
    ProductListComponent,
    ProductFormComponent,
    InventoryComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StockModule,
    SalesModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
