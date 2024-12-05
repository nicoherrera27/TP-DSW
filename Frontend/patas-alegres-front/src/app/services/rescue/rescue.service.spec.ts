import { TestBed } from '@angular/core/testing';

import { RescueService } from './rescue.service';

describe('RescueService', () => {
  let service: RescueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RescueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
