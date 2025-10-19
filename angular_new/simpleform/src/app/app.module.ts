import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SimpleFromComponent } from './simple-from/simple-from.component';
import { ScoreCalcComponent } from './score-calc/score-calc.component';
import { WorkStatusComponent } from './work-status/work-status.component';
import { TimecardFixComponent } from './timecard-fix/timecard-fix.component';
import { ShiftViewComponent } from './shift-view/shift-view.component';
import { SalaryDetailComponent } from './salary-detail/salary-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleFromComponent,
    ScoreCalcComponent,
    WorkStatusComponent,
    TimecardFixComponent,
    ShiftViewComponent,
    SalaryDetailComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
