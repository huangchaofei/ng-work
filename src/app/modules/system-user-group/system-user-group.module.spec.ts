import { SystemUserGroupModule } from './system-user-group.module';

describe('SystemUserGroupModule', () => {
  let systemUserGroupModule: SystemUserGroupModule;

  beforeEach(() => {
    systemUserGroupModule = new SystemUserGroupModule();
  });

  it('should create an instance', () => {
    expect(systemUserGroupModule).toBeTruthy();
  });
});
