import { SurveyOption } from './SurveyOption';

export class PublicSurveyInfo {
  constructor(
    public title: string,
    public options: SurveyOption[]) { }
}
