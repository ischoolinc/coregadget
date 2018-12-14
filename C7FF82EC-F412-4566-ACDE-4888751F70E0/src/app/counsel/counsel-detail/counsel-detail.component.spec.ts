import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselDetailComponent } from './counsel-detail.component';

describe('CounselDetailComponent', () => {
  let component: CounselDetailComponent;
  let fixture: ComponentFixture<CounselDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounselDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounselDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
