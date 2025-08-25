import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { configAccessGuard } from './config-access.guard';

describe('configAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => configAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
