import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockRoutingModule } from './stock-routing.module';
import { StockListComponent } from '../pages/stock/stock-list/stock-list.component';
import { StockAdjustModalComponent } from '../pages/stock/stock-adjust/stock-adjust-modal.component';
import { FormsModule } from '@angular/forms';
import { HistoryComponent } from '../pages/stock/history/history.component';
@NgModule({
  declarations: [StockListComponent, StockAdjustModalComponent, HistoryComponent],
  imports: [CommonModule, StockRoutingModule, FormsModule],
  exports: [StockListComponent],
})
export class StockModule { }
