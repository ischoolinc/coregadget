import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInterviewModalComponent } from './add-interview-modal.component';

describe('AddInterviewModalComponent', () => {
  let component: AddInterviewModalComponent;
  let fixture: ComponentFixture<AddInterviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInterviewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
