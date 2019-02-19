import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMonitorComponent } from './device-monitor.component';

describe('DeviceMonitorComponent', () => {
  let component: DeviceMonitorComponent;
  let fixture: ComponentFixture<DeviceMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
