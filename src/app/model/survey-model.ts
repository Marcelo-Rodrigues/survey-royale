import { SurveyOption } from './survey-option';

export class SurveyModel {
  constructor(public title: string, public options: SurveyOption[]) {}
}
