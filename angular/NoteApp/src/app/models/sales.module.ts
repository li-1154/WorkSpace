import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from '../pages/sales/sales.component';
import { ExportPanelComponent } from '../pages/sales-analysis/export-panel/export-panel.component';
import { PieChartComponent } from '../pages/sales-analysis/pie-chart/pie-chart.component'
import { ProductSalesChartComponent } from '../pages/sales-analysis/product-sales-chart/product-sales-chart.component';
@NgModule({
  declarations: [SalesComponent, ExportPanelComponent, PieChartComponent, ProductSalesChartComponent],
  imports: [CommonModule, FormsModule, SalesRoutingModule],
  exports: [SalesComponent],
})
export class SalesModule { }
