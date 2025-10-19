import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreCalcComponent } from './score-calc.component';

describe('ScoreCalcComponent', () => {
  let component: ScoreCalcComponent;
  let fixture: ComponentFixture<ScoreCalcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreCalcComponent]
    });
    fixture = TestBed.createComponent(ScoreCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
