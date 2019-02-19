import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUserGroupListComponent } from './system-user-group-list.component';

describe('SystemUserGroupListComponent', () => {
  let component: SystemUserGroupListComponent;
  let fixture: ComponentFixture<SystemUserGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemUserGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemUserGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
