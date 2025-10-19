import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimecardFixComponent } from './timecard-fix.component';

describe('TimecardFixComponent', () => {
  let component: TimecardFixComponent;
  let fixture: ComponentFixture<TimecardFixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimecardFixComponent]
    });
    fixture = TestBed.createComponent(TimecardFixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
