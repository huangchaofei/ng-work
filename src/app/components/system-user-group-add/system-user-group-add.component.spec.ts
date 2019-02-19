import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUserGroupAddComponent } from './system-user-group-add.component';

describe('SystemUserGroupAddComponent', () => {
  let component: SystemUserGroupAddComponent;
  let fixture: ComponentFixture<SystemUserGroupAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemUserGroupAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemUserGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
