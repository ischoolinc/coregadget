import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewModalComponent } from './view-interview-modal.component';

describe('ViewInterviewModalComponent', () => {
  let component: ViewInterviewModalComponent;
  let fixture: ComponentFixture<ViewInterviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInterviewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInterviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
