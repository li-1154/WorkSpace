import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadWeeklySalesChartComponent } from './load-weekly-sales-chart.component';

describe('LoadWeeklySalesChartComponent', () => {
  let component: LoadWeeklySalesChartComponent;
  let fixture: ComponentFixture<LoadWeeklySalesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadWeeklySalesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadWeeklySalesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
