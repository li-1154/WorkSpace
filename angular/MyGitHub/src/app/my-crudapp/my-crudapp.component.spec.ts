import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCRUDAppComponent } from './my-crudapp.component';

describe('MyCRUDAppComponent', () => {
  let component: MyCRUDAppComponent;
  let fixture: ComponentFixture<MyCRUDAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCRUDAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCRUDAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
