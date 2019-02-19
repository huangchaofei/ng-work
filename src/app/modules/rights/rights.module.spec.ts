import { RightsModule } from './rights.module';

describe('RightsModule', () => {
  let rightsModule: RightsModule;

  beforeEach(() => {
    rightsModule = new RightsModule();
  });

  it('should create an instance', () => {
    expect(rightsModule).toBeTruthy();
  });
});
