import { TestBed, inject } from '@angular/core/testing';

import { SystemUserService } from './system-user.service';

describe('SystemUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemUserService]
    });
  });

  it('should be created', inject([SystemUserService], (service: SystemUserService) => {
    expect(service).toBeTruthy();
  }));
});
