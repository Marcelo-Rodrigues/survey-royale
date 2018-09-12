import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyAccessInfoComponent } from './survey-access-info.component';

describe('SurveyAccesInfoComponent', () => {
  let component: SurveyAccessInfoComponent;
  let fixture: ComponentFixture<SurveyAccessInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyAccessInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyAccessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
