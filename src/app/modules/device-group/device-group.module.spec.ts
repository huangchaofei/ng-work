import { DeviceGroupModule } from './device-group.module';

describe('DeviceGroupModule', () => {
  let deviceGroupModule: DeviceGroupModule;

  beforeEach(() => {
    deviceGroupModule = new DeviceGroupModule();
  });

  it('should create an instance', () => {
    expect(deviceGroupModule).toBeTruthy();
  });
});
