import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamScoreDetailComponent } from './exam-score-detail.component';

describe('ExamScoreDetailComponent', () => {
  let component: ExamScoreDetailComponent;
  let fixture: ComponentFixture<ExamScoreDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamScoreDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamScoreDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
