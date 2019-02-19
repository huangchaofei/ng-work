import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceGroupDetailComponent } from './device-group-detail.component';

describe('DeviceGroupDetailComponent', () => {
  let component: DeviceGroupDetailComponent;
  let fixture: ComponentFixture<DeviceGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceGroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
