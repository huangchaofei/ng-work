import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseAddComponent } from './enterprise-add.component';

describe('EnterpriseAddComponent', () => {
  let component: EnterpriseAddComponent;
  let fixture: ComponentFixture<EnterpriseAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
