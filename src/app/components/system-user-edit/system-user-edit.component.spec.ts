import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUserEditComponent } from './system-user-edit.component';

describe('SystemUserEditComponent', () => {
  let component: SystemUserEditComponent;
  let fixture: ComponentFixture<SystemUserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemUserEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
