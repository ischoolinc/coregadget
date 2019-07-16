import { TestBed } from '@angular/core/testing';

import { PsychologicalTestService } from './psychological-test.service';

describe('PsychologicalTestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PsychologicalTestService = TestBed.get(PsychologicalTestService);
    expect(service).toBeTruthy();
  });
});
