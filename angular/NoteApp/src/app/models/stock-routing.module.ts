import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockListComponent } from '../pages/stock/stock-list/stock-list.component';
import { HistoryComponent } from '../pages/stock/history/history.component';
// 如果你还没有 detail，以后再加
// import { StockDetailComponent } from './pages/stock-detail/stock-detail.component';

const routes: Routes = [
  { path: '', component: StockListComponent }, // { path: 'detail/:code', component: StockDetailComponent } // 以后加
  { path: 'history/:productId', component: HistoryComponent }, // { path: 'detail/:code', component: StockDetailComponent } // 以后加
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockRoutingModule { }
