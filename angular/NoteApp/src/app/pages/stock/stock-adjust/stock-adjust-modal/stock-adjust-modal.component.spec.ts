import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustModalComponent } from './stock-adjust-modal.component';

describe('StockAdjustModalComponent', () => {
  let component: StockAdjustModalComponent;
  let fixture: ComponentFixture<StockAdjustModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockAdjustModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
