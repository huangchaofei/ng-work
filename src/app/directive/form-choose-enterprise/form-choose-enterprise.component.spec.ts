import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormChooseEnterpriseComponent } from './form-choose-enterprise.component';

describe('FormChooseEnterpriseComponent', () => {
  let component: FormChooseEnterpriseComponent;
  let fixture: ComponentFixture<FormChooseEnterpriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormChooseEnterpriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormChooseEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
