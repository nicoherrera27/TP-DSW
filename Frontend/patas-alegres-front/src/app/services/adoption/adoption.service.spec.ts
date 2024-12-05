import { TestBed } from '@angular/core/testing';

import { AdoptionService } from './adoption.service';

describe('AdoptionService', () => {
  let service: AdoptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdoptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
