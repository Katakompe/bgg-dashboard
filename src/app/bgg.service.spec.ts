import { TestBed } from '@angular/core/testing';

import { BggService } from './bgg.service';

describe('BggService', () => {
  let service: BggService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BggService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
