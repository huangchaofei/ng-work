import { TestBed, inject } from '@angular/core/testing';

import { SystemUserGroupService } from './system-user-group.service';

describe('SystemUserGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemUserGroupService]
    });
  });

  it('should be created', inject([SystemUserGroupService], (service: SystemUserGroupService) => {
    expect(service).toBeTruthy();
  }));
});
