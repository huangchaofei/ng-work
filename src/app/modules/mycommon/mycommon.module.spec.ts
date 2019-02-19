import { MycommonModule } from './mycommon.module';

describe('MycommonModule', () => {
  let mycommonModule: MycommonModule;

  beforeEach(() => {
    mycommonModule = new MycommonModule();
  });

  it('should create an instance', () => {
    expect(mycommonModule).toBeTruthy();
  });
});
