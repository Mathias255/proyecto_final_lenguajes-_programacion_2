import { TestBed } from '@angular/core/testing';

import { AdminGuards } from './admin-guards';

describe('AdminGuards', () => {
  let service: AdminGuards;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminGuards);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
