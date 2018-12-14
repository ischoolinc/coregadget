import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterScoreDetailComponent } from './semester-score-detail.component';

describe('SemesterScoreDetailComponent', () => {
  let component: SemesterScoreDetailComponent;
  let fixture: ComponentFixture<SemesterScoreDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemesterScoreDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemesterScoreDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
