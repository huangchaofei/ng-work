import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormChooseAddressComponent } from './form-choose-address.component';

describe('FormChooseAddressComponent', () => {
  let component: FormChooseAddressComponent;
  let fixture: ComponentFixture<FormChooseAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormChooseAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormChooseAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
