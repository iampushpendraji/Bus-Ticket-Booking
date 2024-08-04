import { TestBed } from '@angular/core/testing';

import { UserApiServiceService } from './user-api-service.service';

describe('UserApiServiceService', () => {
  let service: UserApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
