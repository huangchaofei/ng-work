import { StationModule } from './station.module';

describe('StationModule', () => {
  let stationModule: StationModule;

  beforeEach(() => {
    stationModule = new StationModule();
  });

  it('should create an instance', () => {
    expect(stationModule).toBeTruthy();
  });
});
