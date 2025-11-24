import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockListComponent } from '../pages/stock/stock-list/stock-list.component';
import { StockFormComponent } from '../pages/stock/stock-form/stock-form.component';
// 如果你还没有 detail，以后再加
// import { StockDetailComponent } from './pages/stock-detail/stock-detail.component';

const routes: Routes = [
  { path: '', component: StockListComponent },
  { path: 'edit/:code', component: StockFormComponent },
  // { path: 'detail/:code', component: StockDetailComponent } // 以后加
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
