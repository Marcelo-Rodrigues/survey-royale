import { TestBed, inject } from '@angular/core/testing';

import { TypeSurveyService } from './type-survey.service';

describe('TypeSurveyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeSurveyService]
    });
  });

  it('should be created', inject([TypeSurveyService], (service: TypeSurveyService) => {
    expect(service).toBeTruthy();
  }));
});
