import { TestBed, inject } from '@angular/core/testing';

import { DeviceGroupService } from './device-group.service';

describe('DeviceGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceGroupService]
    });
  });

  it('should be created', inject([DeviceGroupService], (service: DeviceGroupService) => {
    expect(service).toBeTruthy();
  }));
});
