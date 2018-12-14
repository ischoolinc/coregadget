import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentDetailComponent } from './absent-detail.component';

describe('AbsentDetailComponent', () => {
  let component: AbsentDetailComponent;
  let fixture: ComponentFixture<AbsentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
