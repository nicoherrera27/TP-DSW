import { TestBed } from '@angular/core/testing';

import { ShelterService } from './shelter.service';

describe('ShelterService', () => {
  let service: ShelterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShelterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
