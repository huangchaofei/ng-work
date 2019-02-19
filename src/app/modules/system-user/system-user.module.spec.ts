import { SystemUserModule } from './system-user.module';

describe('SystemUserModule', () => {
  let systemUserModule: SystemUserModule;

  beforeEach(() => {
    systemUserModule = new SystemUserModule();
  });

  it('should create an instance', () => {
    expect(systemUserModule).toBeTruthy();
  });
});
