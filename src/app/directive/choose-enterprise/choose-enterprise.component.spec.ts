import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseEnterpriseComponent } from './choose-enterprise.component';

describe('ChooseEnterpriseComponent', () => {
  let component: ChooseEnterpriseComponent;
  let fixture: ComponentFixture<ChooseEnterpriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseEnterpriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
