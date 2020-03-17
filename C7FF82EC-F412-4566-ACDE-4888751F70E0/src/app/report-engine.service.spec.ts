import { TestBed } from '@angular/core/testing';

import { ReportEngineService } from './report-engine.service';

describe('ReportEngineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportEngineService = TestBed.get(ReportEngineService);
    expect(service).toBeTruthy();
  });
});
