import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Myc02Component } from './myc02.component';

describe('Myc02Component', () => {
  let component: Myc02Component;
  let fixture: ComponentFixture<Myc02Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Myc02Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Myc02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
