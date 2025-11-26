import { TestBed } from '@angular/core/testing';

import { ModleService } from './modle.service';

describe('ModleService', () => {
  let service: ModleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
