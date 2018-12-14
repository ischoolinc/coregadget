import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychologicalTestDetailComponent } from './psychological-test-detail.component';

describe('PsychologicalTestDetailComponent', () => {
  let component: PsychologicalTestDetailComponent;
  let fixture: ComponentFixture<PsychologicalTestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsychologicalTestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsychologicalTestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
