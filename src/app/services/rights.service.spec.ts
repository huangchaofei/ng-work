import { TestBed, inject } from '@angular/core/testing';

import { RightsService } from './rights.service';

describe('RightsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RightsService]
    });
  });

  it('should be created', inject([RightsService], (service: RightsService) => {
    expect(service).toBeTruthy();
  }));
});
