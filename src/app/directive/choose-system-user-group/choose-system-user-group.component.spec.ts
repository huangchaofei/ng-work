import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSystemUserGroupComponent } from './choose-system-user-group.component';

describe('ChooseSystemUserGroupComponent', () => {
  let component: ChooseSystemUserGroupComponent;
  let fixture: ComponentFixture<ChooseSystemUserGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseSystemUserGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSystemUserGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
