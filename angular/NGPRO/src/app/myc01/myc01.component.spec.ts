import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Myc01Component } from './myc01.component';

describe('Myc01Component', () => {
  let component: Myc01Component;
  let fixture: ComponentFixture<Myc01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Myc01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Myc01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
