import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { verifyUserGuard } from './verify-user.guard';

describe('verifyUserGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => verifyUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
