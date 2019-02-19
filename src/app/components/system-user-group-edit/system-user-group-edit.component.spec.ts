import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUserGroupEditComponent } from './system-user-group-edit.component';

describe('SystemUserGroupEditComponent', () => {
  let component: SystemUserGroupEditComponent;
  let fixture: ComponentFixture<SystemUserGroupEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemUserGroupEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemUserGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
