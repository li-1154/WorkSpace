import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from '../pages/sales/sales.component';
import { ExportPanelComponent } from '../pages/sales-analysis/export-panel/export-panel.component';

@NgModule({
  declarations: [SalesComponent, ExportPanelComponent],
  imports: [CommonModule, FormsModule, SalesRoutingModule],
  exports: [SalesComponent],
})
export class SalesModule { }
