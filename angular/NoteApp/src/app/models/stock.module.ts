import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockRoutingModule } from './stock-routing.module';
import { StockListComponent } from '../pages/stock/stock-list/stock-list.component';
import { StockFormComponent } from '../pages/stock/stock-form/stock-form.component';



@NgModule({
  declarations: [
    StockListComponent,
    StockFormComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule
  ],
  exports: [StockListComponent]
})
export class StockModule { }
