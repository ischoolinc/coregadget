import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselItemDetailComponent } from './counsel-item-detail.component';

describe('CounselItemDetailComponent', () => {
  let component: CounselItemDetailComponent;
  let fixture: ComponentFixture<CounselItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounselItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounselItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
