import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormChooseStationComponent } from './form-choose-station.component';

describe('FormChooseStationComponent', () => {
  let component: FormChooseStationComponent;
  let fixture: ComponentFixture<FormChooseStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormChooseStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormChooseStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
