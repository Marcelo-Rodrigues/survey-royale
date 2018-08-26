import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSurveyComponent } from './find-survey.component';

describe('FindSurveyComponent', () => {
  let component: FindSurveyComponent;
  let fixture: ComponentFixture<FindSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
